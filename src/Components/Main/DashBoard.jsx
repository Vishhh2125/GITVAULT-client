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
  const [activeDoc, setActiveDoc] = useState(null);

  // Redux state
  const repos = useSelector((state) => state.repos.repos);
  const repoStatus = useSelector((state) => state.repos.status);
  const repoError = useSelector((state) => state.repos.error);
  const user = useSelector((state) => state.user.user);
  const patTokens = useSelector((state) => state.pat.tokens);
  const patStatus = useSelector((state) => state.pat.status);
  const patError = useSelector((state) => state.pat.error);

  const docs = {
    init: ['Create repo from dashboard','Clone repo using git clone','Make first commit','Push to remote'],
    token: ['Open settings','Generate new PAT','Copy token','Use token in CLI'],
    branch: ['Create branch','Switch branch','Commit changes','Merge branch'],
    cli: ['Install CLI','Login using token','Run gitvault status','Push changes'],
    collab: ['Open repo','Invite user','Assign role','Save changes']
  };

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
          <QuickActionCard icon={<BookOpen />} label="Documentation" description="View guides and help" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#11141d] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Repositories</h2>
              <SafeLink to="/repositories" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">View all</SafeLink>
            </div>

            <div className="divide-y divide-white/5">
              {repoStatus === 'loading' ? (
                <div className="p-6 text-center text-slate-400">Loading repositories...</div>
              ) : recentRepos.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  No repositories yet. Create your first repository!
                </div>
              ) : (
                recentRepos.map(repo => {
                  const userRole = getUserRole(repo);
                  return (
                    <SafeLink key={repo._id} to={`/repositories/${repo._id}`} className="block p-6 hover:bg-white/[0.02] transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">{repo.name}</h3>
                            {userRole && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 capitalize whitespace-nowrap">
                                {userRole}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm mt-1">{repo.description || 'No description'}</p>
                          <div className="flex gap-3 text-xs text-slate-500 mt-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Updated {formatTime(repo.updatedAt)}
                            </span>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full capitalize whitespace-nowrap flex-shrink-0 ${
                          repo.visibility === 'public' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                        }`}>
                          {repo.visibility}
                        </span>
                      </div>
                    </SafeLink>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-[#11141d] border border-white/5 rounded-2xl shadow-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Account Overview</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex justify-between items-center py-1 border-b border-white/5">
                  <span>Total Repositories</span>
                  <span className="text-indigo-400 font-semibold">{totalRepos}</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-white/5">
                  <span>Private Repositories</span>
                  <span className="text-indigo-400 font-semibold">{privateRepos}</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-white/5">
                  <span>Public Repositories</span>
                  <span className="text-indigo-400 font-semibold">{publicRepos}</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-white/5">
                  <span>Active Access Tokens</span>
                  <span className="text-indigo-400 font-semibold">{activeTokens}</span>
                </li>
                <li className="flex justify-between items-center py-1">
                  <span>Total Collaborators</span>
                  <span className="text-indigo-400 font-semibold">{totalCollaborators}</span>
                </li>
              </ul>
            </div>
            <div className="border-t border-white/5 pt-4">
              <h3 className="text-lg font-semibold text-white mb-2">Security Health</h3>
              <p className={`text-2xl font-bold ${scoreColor} mb-2`}>{securityHealth.score} / 100</p>
              
              {securityHealth.achievements.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-1">Strengths:</p>
                  <ul className="text-sm text-slate-400 space-y-1">
                    {securityHealth.achievements.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {securityHealth.issues.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Areas to improve:</p>
                  <ul className="text-sm text-slate-400 space-y-1">
                    {securityHealth.issues.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Circle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                View Security Report
              </button>
            </div>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="mt-10 bg-[#11141d] border border-white/5 rounded-2xl shadow-2xl p-6">
          <div className="pb-4 border-b border-white/5 mb-4">
            <h2 className="text-xl font-semibold text-white">GitVault Documentation</h2>
            <p className="text-slate-500 text-xs mt-1">Learn how to use GitVault effectively</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="cursor-pointer hover:text-indigo-400 transition-colors py-1 px-2 rounded-lg hover:bg-white/5" onClick={()=>setActiveDoc('init')}>• How to initialize a repository</li>
                <li className="cursor-pointer hover:text-indigo-400 transition-colors py-1 px-2 rounded-lg hover:bg-white/5" onClick={()=>setActiveDoc('token')}>• How to generate & use Personal Access Tokens</li>
                <li className="cursor-pointer hover:text-indigo-400 transition-colors py-1 px-2 rounded-lg hover:bg-white/5" onClick={()=>setActiveDoc('branch')}>• How to clone, push, and manage branches</li>
                <li className="cursor-pointer hover:text-indigo-400 transition-colors py-1 px-2 rounded-lg hover:bg-white/5" onClick={()=>setActiveDoc('cli')}>• Using GitVault CLI</li>
                <li className="cursor-pointer hover:text-indigo-400 transition-colors py-1 px-2 rounded-lg hover:bg-white/5" onClick={()=>setActiveDoc('collab')}>• Managing collaborators & permissions</li>
              </ul>
            </div>
            <div className="bg-[#0b0d14] border border-white/10 rounded-xl p-4">
              {activeDoc ? (
                <ol className="list-decimal ml-5 space-y-2 text-sm text-slate-300">
                  {docs[activeDoc].map((step,i)=>(<li key={i} className="py-1">{step}</li>))}
                </ol>
              ) : <p className="text-slate-500 text-sm">Select a topic to view steps</p>}
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
      <div className="text-indigo-400 mb-3 group-hover:text-indigo-300 transition-colors">{icon}</div>
      <h3 className="text-white text-sm font-semibold mb-1">{label}</h3>
      <p className="text-slate-400 text-xs">{description}</p>
    </>
  );

  if (onClick) {
    return (
      <div 
        className="bg-[#11141d] border border-white/5 rounded-xl p-6 hover:border-indigo-400/50 hover:bg-indigo-400/5 transition-all duration-200 cursor-pointer group shadow-lg"
        onClick={onClick}
      >
        {cardContent}
      </div>
    );
  }

  const card = (
    <div className="bg-[#11141d] border border-white/5 rounded-xl p-6 hover:border-indigo-400/50 hover:bg-indigo-400/5 transition-all duration-200 cursor-pointer group shadow-lg">
      {cardContent}
    </div>
  );

  return link ? <SafeLink to={link}>{card}</SafeLink> : card;
}
