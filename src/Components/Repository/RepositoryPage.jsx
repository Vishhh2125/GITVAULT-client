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
    <div className="text-slate-200 h-full flex flex-col p-4 md:p-6 space-y-4">
      
      {/* COMPACT HEADER: Title and Button on one line, Description below */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Repositories
          </h1>
          <p className="text-slate-500 text-xs">Manage your digital vaults.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
           New Repository
        </button>
      </div>

      {/* Create Repository Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d2e] border border-indigo-500/30 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Create New Repository</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewRepoData({ name: '', description: '', visibility: 'private' });
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-slate-400 text-sm mb-4">
              Create a new repository to store your code and collaborate with others.
            </p>

            <div className="space-y-4 mb-6">
              {/* Repository Name */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Repository Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newRepoData.name}
                  onChange={(e) => setNewRepoData({ ...newRepoData, name: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateRepo()}
                  placeholder="e.g., my-awesome-project"
                  className="w-full px-4 py-2 rounded-lg bg-[#0b0d14] border border-indigo-400/20 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-white placeholder-slate-500 transition-all"
                  disabled={creating}
                />
                <p className="text-xs text-slate-500 mt-1">Must be unique and alphanumeric</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Description <span className="text-slate-500">(optional)</span>
                </label>
                <textarea
                  value={newRepoData.description}
                  onChange={(e) => setNewRepoData({ ...newRepoData, description: e.target.value })}
                  placeholder="Brief description of your repository"
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg bg-[#0b0d14] border border-indigo-400/20 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-white placeholder-slate-500 transition-all resize-none"
                  disabled={creating}
                />
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">Visibility</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewRepoData({ ...newRepoData, visibility: 'public' })}
                    disabled={creating}
                    className={`p-3 rounded-lg border transition-all ${
                      newRepoData.visibility === 'public'
                        ? 'bg-indigo-500/10 border-indigo-500 text-white'
                        : 'bg-[#0b0d14] border-indigo-400/20 text-slate-400 hover:border-indigo-400/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">Public</span>
                    </div>
                    <p className="text-xs text-left mt-1 opacity-70">Anyone can see</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setNewRepoData({ ...newRepoData, visibility: 'private' })}
                    disabled={creating}
                    className={`p-3 rounded-lg border transition-all ${
                      newRepoData.visibility === 'private'
                        ? 'bg-indigo-500/10 border-indigo-500 text-white'
                        : 'bg-[#0b0d14] border-indigo-400/20 text-slate-400 hover:border-indigo-400/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-sm font-medium">Private</span>
                    </div>
                    <p className="text-xs text-left mt-1 opacity-70">Only you can see</p>
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
                className="flex-1 px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-800/50 text-slate-300 text-sm font-medium transition-all"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRepo}
                disabled={creating || !newRepoData.name.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      {/* COMPACT SEARCH: Reduced vertical margin */}
      <div className="group">
        <div className="relative max-w-xl flex items-center">
          <div className="absolute left-3.5 z-10 pointer-events-none flex items-center justify-center">
            <svg className="h-4 w-4 text-indigo-400/70 group-focus-within:text-indigo-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#161927] border border-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />
        </div>
      </div>

      {/* REPOSITORY LIST */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {filteredRepos.length > 0 ? (
          <div className="bg-[#11141d] border border-white/5 rounded-2xl shadow-2xl overflow-hidden divide-y divide-white/5">
            {filteredRepos.map((repo) => {
              const userRole = getUserRole(repo);
              return (
                <div
                  key={repo._id}
                  onClick={() => navigate(`/repositories/${repo._id}`)}
                  className="block p-6 hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                          {repo.name}
                        </h3>
                        {userRole && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 capitalize whitespace-nowrap">
                            {userRole}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mt-1">
                        {repo.description || 'No description'}
                      </p>
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
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <div className="text-slate-500 text-sm italic">No repositories found</div>
          </div>
        )}
      </div>
    </div>
  );
}