import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { getRepos, resetRepos, createRepo } from '../../features/repoSlice.js';
import LoadingState from '../Layout/Loading.jsx';
import ErrorState from '../Layout/Error.jsx';
import toast from 'react-hot-toast';
import { Clock } from 'lucide-react';


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

export default function RepositoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRepoData, setNewRepoData] = useState({
    name: '',
    description: '',
    visibility: 'private'
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //all redux state  
  const repoError = useSelector((state) => state.repos.error);
  const repos = useSelector((state) => state.repos.repos);
  const repoStatus = useSelector((state) => state.repos.status);
  const creating = useSelector((state) => state.repos.creating);
  const creatingError = useSelector((state) => state.repos.creatingError);
  const fileStatus = useSelector((state) => state.fileTree.status);
  const collaboratorStatus = useSelector((state) => state.collaborators.status);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if(repoStatus === "idle"){
      dispatch(getRepos());
    }
  }, [dispatch, repoStatus]);

  useEffect(()=>{
    if(creatingError){
      toast.error(`${creatingError}`);
    }
  }, [creatingError]);

  const handleCreateRepo = async () => {
    if (!newRepoData.name.trim()) {
      toast.error('Please enter a repository name');
      return;
    }
    
    try {
      await dispatch(createRepo(newRepoData)).unwrap();
      setNewRepoData({ name: '', description: '', visibility: 'private' });
      setShowCreateModal(false);
      toast.success('Repository created successfully!');
    } catch (error) {
      // Error already handled by useEffect
    }
  };

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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


  if(repoStatus==="loading")return(<LoadingState/>)
  else if(repoStatus==="failed") return (<ErrorState
                                            message={`${repoError}`}
                                            onRetry={()=>dispatch(resetRepoStatus())} />)
  else  return (
    <div className="min-h-full bg-[#0b0e14] relative text-slate-200 flex flex-col">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none z-0" />
      
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-20 bg-[#0b0e14]/95 backdrop-blur-sm border-b border-white/5">
        <div className="relative z-10 px-8 pt-8 pb-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                  Repositories
                </h1>
                <p className="text-slate-500 text-sm">Manage your code repositories and collaborate with your team</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95 whitespace-nowrap flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                New Repository
              </button>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl">
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search repositories..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#11141d] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Repository List */}
          {filteredRepos.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRepos.map((repo) => {
                const userRole = getUserRole(repo);
                return (
                  <div
                    key={repo._id}
                    onClick={() => navigate(`/repositories/${repo._id}`)}
                    className="group bg-[#11141d] border border-white/5 rounded-xl p-5 hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-indigo-500/5"
                  >
                    {/* Header with Icon and Visibility */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-base group-hover:text-indigo-300 transition-colors truncate">
                            {repo.name}
                          </h3>
                          {userRole && (
                            <span className="inline-block text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize mt-1">
                              {userRole}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
                        repo.visibility === 'public' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {repo.visibility}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                      {repo.description || 'No description provided'}
                    </p>

                    {/* Footer with metadata */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Updated {formatTime(repo.updatedAt)}</span>
                      </div>
                      <svg className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#11141d] border border-white/5 rounded-2xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">No repositories found</p>
              <p className="text-slate-500 text-xs mt-1">Try adjusting your search or create a new repository</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Repository Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#11141d] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Create New Repository</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewRepoData({ name: '', description: '', visibility: 'private' });
                }}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-slate-400 text-sm mb-6">
              Create a new repository to store your code and collaborate with others.
            </p>

            <div className="space-y-4 mb-6">
              {/* Repository Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Repository Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newRepoData.name}
                  onChange={(e) => setNewRepoData({ ...newRepoData, name: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateRepo()}
                  placeholder="e.g., my-awesome-project"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0b0d14] border border-white/10 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-white placeholder-slate-500 transition-all"
                  disabled={creating}
                />
                <p className="text-xs text-slate-500 mt-1.5">Must be unique and alphanumeric</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description <span className="text-slate-500">(optional)</span>
                </label>
                <textarea
                  value={newRepoData.description}
                  onChange={(e) => setNewRepoData({ ...newRepoData, description: e.target.value })}
                  placeholder="Brief description of your repository"
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0b0d14] border border-white/10 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-white placeholder-slate-500 transition-all resize-none"
                  disabled={creating}
                />
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Visibility</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewRepoData({ ...newRepoData, visibility: 'public' })}
                    disabled={creating}
                    className={`p-4 rounded-lg border transition-all ${
                      newRepoData.visibility === 'public'
                        ? 'bg-green-500/10 border-green-500/50 text-white shadow-lg shadow-green-500/10'
                        : 'bg-[#0b0d14] border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold">Public</span>
                    </div>
                    <p className="text-xs text-left opacity-70">Anyone can see this</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setNewRepoData({ ...newRepoData, visibility: 'private' })}
                    disabled={creating}
                    className={`p-4 rounded-lg border transition-all ${
                      newRepoData.visibility === 'private'
                        ? 'bg-slate-500/10 border-slate-500/50 text-white shadow-lg shadow-slate-500/10'
                        : 'bg-[#0b0d14] border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-sm font-semibold">Private</span>
                    </div>
                    <p className="text-xs text-left opacity-70">Only you can see</p>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewRepoData({ name: '', description: '', visibility: 'private' });
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white text-sm font-medium transition-all"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRepo}
                disabled={creating || !newRepoData.name.trim()}
                className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {creating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Repository'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}