import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRepoInfo, updateRepo, deleteRepo, resetRepoInfo } from '../../features/repoSlice.js';
import FilesTab from './FileTab.jsx';
import CollaboratorsTab from './Collaborator.jsx';
import LoadingState from '../Layout/Loading.jsx';
import ErrorState from '../Layout/Error.jsx';
import toast from 'react-hot-toast';
import SettingsTab from './repoSetting.jsx';
import api from '../../api/api.js';

function RepositoryDetailPage() {
  const { id:repoId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('files');

  const currentRepo = useSelector(state => state.repos.currentRepo);
  const repoInfoStatus = useSelector(state => state.repos.repoInfoStatus);
  const repoInfoError = useSelector(state => state.repos.repoInfoError);
  const user = useSelector(state => state.user.user);



  useEffect(() => {
    // Fetch repo info
    if (repoId && repoInfoStatus === "idle") {
      dispatch(getRepoInfo(repoId));
    }
  }, [dispatch, repoId, repoInfoStatus]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      dispatch(resetRepoInfo());
    };
  }, [dispatch]);


  // useEffect(() => {
  //   if (activeTab === 'files' && fileStatus === "idle") {
  //     dispatch(getFileTree({repoId, path: '/', ref: 'main'}));
  //   }
  // }, [dispatch, fileStatus, repoId, activeTab]);

  // useEffect(()=>{
  //   if(activeTab === 'collaborators' && collaboratorsStatus==="idle"){
  //     dispatch( getCollaborators( repoId ) );
  //   }
  // },[dispatch,repoId,collaboratorsStatus,activeTab])

  const handleTabChange = (tabId) => {
   
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'files', label: 'Files', icon: 'files' },
    { id: 'collaborators', label: 'Collaborators', icon: 'users' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const backButtonHandler = () => {
    navigate('/repositories');
  }

  const isOwner = currentRepo && user && currentRepo.owner._id === user._id;

  if (repoInfoStatus === "loading") {
    return <LoadingState />;
  }

  if (repoInfoStatus === "failed") {
    return <ErrorState message={repoInfoError} onRetry={() => dispatch(getRepoInfo(repoId))} />;
  }

  if (!currentRepo) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get git clone URL
  const getCloneUrl = () => {
    if (!currentRepo || !currentRepo.owner) return '';
    // Get base URL from api config (remove /api/v1 for git URLs)
    const baseUrl = api.defaults.baseURL.replace('/api/v1', '');
    const username = currentRepo.owner.username;
    const repoName = currentRepo.name;
    return `${baseUrl}/git/${username}/${repoName}.git`;
  };

  const cloneUrl = getCloneUrl();

  const handleCopyCloneUrl = async () => {
    if (!cloneUrl) return;
    try {
      await navigator.clipboard.writeText(cloneUrl);
      toast.success('Clone URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      toast.error('Failed to copy URL');
    }
  };

  return (
    <div className="min-h-full bg-[#0b0e14] relative text-slate-200">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <button 
            onClick={backButtonHandler}  
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-400 transition-all duration-200 font-medium"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">Back to Repositories</span>
          </button>

          {/* Repository Header */}
          <div className="bg-[#11141d] rounded-2xl p-8 border border-white/5 shadow-2xl">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{currentRepo.name}</h1>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Owned by <span className="text-indigo-400 font-semibold">{currentRepo.owner.username}</span>
                    </p>
                  </div>
                </div>
                <p className="text-slate-300 mb-4">{currentRepo.description || 'No description provided'}</p>

                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                    currentRepo.visibility === 'public'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                  }`}>
                    <span className="flex items-center gap-1.5">
                      {currentRepo.visibility === 'public' ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      {currentRepo.visibility}
                    </span>
                  </span>
                  
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <span>Created {formatDate(currentRepo.createdAt)}</span>
                    {currentRepo.updatedAt && currentRepo.updatedAt !== currentRepo.createdAt && (
                      <>
                        <span>•</span>
                        <span>Updated {formatDate(currentRepo.updatedAt)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-white rounded-lg font-medium transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Star
              </button>
            </div>

            {/* Clone URL Section */}
            <div className="bg-[#0b0d14] rounded-lg p-4 border border-white/5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Clone Repository</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-slate-300 overflow-x-auto whitespace-nowrap">
                  {cloneUrl}
                </div>
                <button
                  onClick={handleCopyCloneUrl}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95 flex items-center gap-2 whitespace-nowrap"
                  title="Copy clone URL"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Use this URL to clone the repository with Git</p>
            </div>
          </div>

          {/* Tabs Container */}
          <div className="bg-[#11141d] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            {/* Tab Headers */}
            <div className="flex border-b border-white/5 bg-white/[0.02]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'text-indigo-400 bg-white/5'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  )}
                  {tab.icon === 'files' && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  )}
                  {tab.icon === 'users' && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  {tab.icon === 'settings' && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'files' && (
                <FilesTab />
              )}
              {activeTab === 'collaborators' && (
                <CollaboratorsTab
                />
              )}
              {activeTab === 'settings' && (
                <SettingsTab />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepositoryDetailPage;


