import { useState ,useEffect} from 'react';
import { useNavigate ,useParams } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { getRepoInfo, updateRepo, deleteRepo, resetRepoInfo } from '../../features/repoSlice.js';
import FilesTab from './FileTab.jsx';
import CollaboratorsTab from './Collaborator.jsx';
import LoadingState from '../Layout/Loading.jsx';
import ErrorState from '../Layout/Error.jsx';
import toast from 'react-hot-toast';
import SettingsTab from './repoSetting.jsx';

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
    if (repoId && repoInfoStatus==="idle") {
      dispatch(getRepoInfo(repoId));
    }

    return () => {
      // repo boundary reset (LEAVE)
      dispatch(resetRepoInfo());
    };
  }, [dispatch, repoId]);


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

  return (
    <div className="text-slate-200 h-full flex flex-col p-4 md:p-8 space-y-6">
      <div className="max-w-7xl w-full mx-auto">
        {/* Back Button - Enhanced */}
        <button 
          onClick={backButtonHandler}  
          className="group mb-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-400 transition-all duration-200 font-medium"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">Back to Repositories</span>
        </button>

        {/* Repository Header - Enhanced */}
        <div className="mb-8 bg-gradient-to-br from-[#1a1d2e] to-[#161927] rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white tracking-tight">{currentRepo.name}</h1>
                  <p className="text-slate-400 text-sm mt-1">
                    Owned by <span className="text-indigo-400 font-semibold">{currentRepo.owner.username}</span>
                  </p>
                </div>
              </div>
              <p className="text-slate-300 text-lg mb-4 leading-relaxed">{currentRepo.description || 'No description provided'}</p>

          <div className="flex items-center gap-5 flex-wrap">
            <span className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${
              currentRepo.visibility === 'public'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-500/20 text-slate-300 border border-slate-500/30 shadow-lg shadow-slate-500/10'
            }`}>
              <span className="flex items-center gap-2">
                {currentRepo.visibility === 'public' ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                {currentRepo.visibility}
              </span>
            </span>
            
            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <span>Created {formatDate(currentRepo.createdAt)}</span>
              {currentRepo.updatedAt && currentRepo.updatedAt !== currentRepo.createdAt && (
                <span>• Updated {formatDate(currentRepo.updatedAt)}</span>
              )}
            </div>
          </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Clone
              </button>
              <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 text-white rounded-lg font-semibold transition-all active:scale-95 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Star
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Container - Enhanced */}
        <div className="bg-gradient-to-br from-[#1a1d2e] to-[#161927] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          {/* Tab Headers - Enhanced */}
          <div className="flex border-b border-white/10 bg-black/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center gap-2.5 px-8 py-4 font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'text-indigo-300 bg-indigo-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                )}
                {tab.icon === 'files' && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                )}
                {tab.icon === 'users' && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
                {tab.icon === 'settings' && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
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
  );
}

export default RepositoryDetailPage;


