// GitVault Dashboard with ChatBot
import ChatBot from './Chatbot.jsx';
import SearchBar from './SearchBar.jsx';
import LoadingState from '../Layout/Loading.jsx';
import ErrorState from '../Layout/Error.jsx';
import { useState, useEffect } from 'react';
import { Plus, Key, BookOpen, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Link, useInRouterContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRepos, resetRepos } from '../../features/repoSlice.js';
import { getPatTokens, resetPats } from '../../features/patSlice.js';

function SafeLink({ to, children, className }) {
  const inRouter = useInRouterContext();
  if (!inRouter) return <a href={to} className={className}>{children}</a>;
  return <Link to={to} className={className}>{children}</Link>;
}


export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const repos = useSelector((state) => state.repos.repos);
  const repoStatus = useSelector((state) => state.repos.status);
  const repoError = useSelector((state) => state.repos.error);
  const user = useSelector((state) => state.user.user);
  const patTokens = useSelector((state) => state.pat.tokens);
  const patStatus = useSelector((state) => state.pat.status);
  const patError = useSelector((state) => state.pat.error);

  useEffect(() => {
    if (repoStatus === 'idle') {
      dispatch(getRepos());
    }
    if (patStatus === 'idle') {
      dispatch(getPatTokens());
    }
  }, [dispatch, repoStatus, patStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetRepos());
      dispatch(resetPats());
    }
  }, [dispatch]);

  // Format date helper
  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  // Calculate stats
  const totalRepos = repos?.length || 0;
  const privateRepos = repos?.filter(repo => repo.visibility === 'private').length || 0;
  const publicRepos = repos?.filter(repo => repo.visibility === 'public').length || 0;
  const totalCollaborators = repos?.reduce((acc, repo) => {
    return acc + (repo.collaborators?.length || 0);
  }, 0) || 0;
  const activeTokens = patTokens?.length || 0;

  // Get recent repos (sorted by updatedAt, limit to 5)
  const recentRepos = repos
    ?.slice()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5) || [];

  // Determine user role in repo
  const getUserRole = (repo) => {
    if (!user || !repo) return null;
    if (repo.owner?._id === user._id || repo.owner === user._id) return 'Owner';
    const collab = repo.collaborators?.find(c => {
      const collabUserId = typeof c.user === 'object' ? c.user._id : c.user;
      return collabUserId === user._id;
    });
    return collab ? collab.role : null;
  };

  // Calculate security score (after calculating stats)
  const calculateSecurityScore = () => {
    let score = 0;
    const issues = [];
    const achievements = [];

    // Rule 1: Token Security (25 points)
    if (activeTokens === 0) {
      achievements.push('No active tokens - Good security practice');
      score += 25;
    } else if (activeTokens <= 2) {
      achievements.push('Limited tokens active');
      score += 20;
    } else if (activeTokens <= 5) {
      issues.push('Multiple tokens active - Review periodically');
      score += 10;
    } else {
      issues.push('Too many active tokens - Security risk');
      score += 0;
    }

    // Rule 2: Repository Visibility (30 points)
    if (totalRepos === 0) {
      // No score for visibility when no repos exist
      score += 0;
    } else {
      const publicRatio = publicRepos / totalRepos;
      if (publicRatio === 0) {
        achievements.push('All repositories are private');
        score += 30;
      } else if (publicRatio <= 0.3) {
        achievements.push('Most repositories are private');
        score += 25;
      } else if (publicRatio <= 0.6) {
        issues.push('Many public repositories - Review access');
        score += 15;
      } else {
        issues.push('Too many public repositories - Security concern');
        score += 5;
      }
    }

    // Rule 3: Repository Management (20 points)
    if (totalRepos === 0) {
      issues.push('No repositories yet');
      score += 0;
    } else if (totalRepos <= 5) {
      achievements.push('Well-managed repository count');
      score += 20;
    } else if (totalRepos <= 15) {
      achievements.push('Active repository management');
      score += 15;
    } else {
      issues.push('Many repositories - Ensure regular maintenance');
      score += 10;
    }

    // Rule 4: Collaboration Security (15 points)
    if (totalRepos === 0) {
      // No score for collaborators when no repos exist
      score += 0;
    } else {
      const avgCollaborators = totalCollaborators / totalRepos;
      if (avgCollaborators === 0) {
        achievements.push('No external collaborators');
        score += 15;
      } else if (avgCollaborators <= 2) {
        achievements.push('Limited collaborators per repo');
        score += 12;
      } else if (avgCollaborators <= 5) {
        issues.push('Review collaborator permissions');
        score += 8;
      } else {
        issues.push('Too many collaborators - Review access');
        score += 3;
      }
    }

    // Rule 5: Account Activity (10 points)
    if (totalRepos > 0 && privateRepos > 0) {
      achievements.push('Active account with private repos');
      score += 10;
    } else if (totalRepos > 0) {
      score += 5;
    }

    return { score, issues, achievements };
  };

  const securityHealth = calculateSecurityScore();
  const scoreColor = securityHealth.score >= 80 ? 'text-green-400' : 
                     securityHealth.score >= 60 ? 'text-yellow-400' : 
                     'text-red-400';

  const handleRetry = () => {
    if (repoStatus === 'failed') {
      dispatch(getRepos());
    }
    if (patStatus === 'failed') {
      dispatch(getPatTokens());
    }
  };

  // Show loading state
  if (repoStatus === 'loading' && repos.length === 0) {
    return (
      <div className="min-h-full bg-[#0b0e14] relative text-slate-200">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none z-0" />
        <div className="relative z-10 p-8">
          <div className="max-w-6xl mx-auto">
            <LoadingState />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (repoStatus === 'failed') {
    return (
      <div className="min-h-full bg-[#0b0e14] relative text-slate-200">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none z-0" />
        <div className="relative z-10 p-8">
          <div className="max-w-6xl mx-auto">
            <ErrorState
              title="Failed to load dashboard"
              message={repoError || 'Unable to fetch repositories. Please try again.'}
              onRetry={handleRetry}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#0b0e14] relative text-slate-200">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="pb-2 mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage your repositories and get started</p>
          </div>

          <div className="mb-8">
            <SearchBar />
          </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <QuickActionCard 
            icon={<Plus />} 
            label="Create Repository" 
            description="Start a new project" 
            onClick={() => navigate('/repositories')}
          />
          <QuickActionCard icon={<Key />} label="Generate Token" description="Create API access token" link="/pat-tokens" />
          <QuickActionCard icon={<BookOpen />} label="Documentation" description="View guides and help" link="/documentation" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recent Repositories</h2>
              <SafeLink to="/repositories" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors flex items-center gap-1">
                View all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </SafeLink>
            </div>

            <div className="space-y-3">
              {repoStatus === 'loading' ? (
                <div className="bg-[#11141d] border border-white/5 rounded-xl p-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 mb-3">
                    <svg className="w-6 h-6 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">Loading repositories...</p>
                </div>
              ) : recentRepos.length === 0 ? (
                <div className="bg-[#11141d] border border-white/5 rounded-xl p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm mb-1">No repositories yet</p>
                  <p className="text-slate-500 text-xs">Create your first repository to get started</p>
                </div>
              ) : (
                recentRepos.map(repo => {
                  const userRole = getUserRole(repo);
                  return (
                    <SafeLink key={repo._id} to={`/repositories/${repo._id}`} className="block group">
                      <div className="bg-[#11141d] border border-white/5 rounded-xl p-5 hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-indigo-500/5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors mt-0.5">
                              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="text-white font-semibold text-base group-hover:text-indigo-300 transition-colors truncate">{repo.name}</h3>
                                {userRole && (
                                  <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize whitespace-nowrap">
                                    {userRole}
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-400 text-sm mb-3 line-clamp-1">{repo.description || 'No description provided'}</p>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  Updated {formatTime(repo.updatedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
                              repo.visibility === 'public' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                            }`}>
                              {repo.visibility}
                            </span>
                            <svg className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </SafeLink>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Account Overview Card */}
            <div className="bg-[#11141d] border border-white/5 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-colors">
                  <span className="text-slate-300 text-sm">Repositories</span>
                  <span className="text-indigo-400 font-bold text-lg">{totalRepos}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-colors">
                  <span className="text-slate-300 text-sm flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Private
                  </span>
                  <span className="text-slate-400 font-semibold">{privateRepos}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-colors">
                  <span className="text-slate-300 text-sm flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Public
                  </span>
                  <span className="text-green-400 font-semibold">{publicRepos}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-colors">
                  <span className="text-slate-300 text-sm">Access Tokens</span>
                  <span className="text-indigo-400 font-semibold">{activeTokens}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-colors">
                  <span className="text-slate-300 text-sm">Collaborators</span>
                  <span className="text-indigo-400 font-semibold">{totalCollaborators}</span>
                </div>
              </div>
            </div>

            {/* Security Health Card */}
            <div className="bg-gradient-to-br from-[#11141d] to-[#0f1119] border border-white/5 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security Health
              </h3>
              
              <div className="flex items-end gap-3 mb-4">
                <div className={`text-4xl font-bold ${scoreColor}`}>{securityHealth.score}</div>
                <div className="text-slate-500 text-sm mb-1.5">/ 100</div>
              </div>

              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    securityHealth.score >= 80 ? 'bg-green-400' : 
                    securityHealth.score >= 60 ? 'bg-yellow-400' : 
                    'bg-red-400'
                  }`}
                  style={{ width: `${securityHealth.score}%` }}
                />
              </div>
              
              {securityHealth.achievements.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-green-400 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Strengths
                  </p>
                  <ul className="space-y-2">
                    {securityHealth.achievements.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-400 bg-green-500/5 border border-green-500/10 rounded-lg p-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {securityHealth.issues.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-yellow-400 mb-2 flex items-center gap-1">
                    <Circle className="w-3.5 h-3.5" />
                    Areas to Improve
                  </p>
                  <ul className="space-y-2">
                    {securityHealth.issues.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-400 bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-2">
                        <Circle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button className="w-full mt-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 group">
                <span>View Full Report</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

function QuickActionCard({ icon, label, description, link, onClick }) {
  const cardContent = (
    <>
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-4 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-200">
        <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors">{icon}</div>
      </div>
      <h3 className="text-white font-semibold mb-1.5">{label}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
      <div className="mt-4 flex items-center gap-1 text-indigo-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Get started</span>
        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </>
  );

  if (onClick) {
    return (
      <div 
        className="bg-[#11141d] border border-white/5 rounded-xl p-6 hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all duration-200 cursor-pointer group shadow-lg hover:shadow-xl hover:shadow-indigo-500/5 active:scale-[0.98]"
        onClick={onClick}
      >
        {cardContent}
      </div>
    );
  }

  const card = (
    <div className="bg-[#11141d] border border-white/5 rounded-xl p-6 hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all duration-200 cursor-pointer group shadow-lg hover:shadow-xl hover:shadow-indigo-500/5 active:scale-[0.98]">
      {cardContent}
    </div>
  );

  return link ? <SafeLink to={link}>{card}</SafeLink> : card;
}
