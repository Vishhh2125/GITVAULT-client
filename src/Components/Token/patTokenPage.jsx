import { useState ,useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { getPatTokens, deletePAT ,resetPats ,clearErrors ,createPat, clearNewlyCreatedToken} from '../../features/patSlice.js';
import toast from 'react-hot-toast';
import LoadingState from '../Layout/Loading.jsx';
import ErrorState from '../Layout/Error.jsx';
function PatTokenPage() {

  const dispatch = useDispatch();

  
  
  const {
    tokens: patTokens,
    status: patStatus,
    error: patError,
    deletingId,
    actionError,
    creating,
    createError,
    newlyCreatedToken
  } = useSelector((state) => state.pat);
     
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTokenLabel, setNewTokenLabel] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);

  // 1]]
  useEffect(()=>{
    dispatch(clearErrors())
    if(patStatus==="idle"){
      
      dispatch(getPatTokens());
    }

    return ()=>{
      dispatch(resetPats());
    }
  }, [  dispatch]);

  // 2]Show toast for action errors
  useEffect(() => {
    if (actionError) {
      toast.error(actionError.message || 'Operation failed');
    }
  }, [actionError]);

  // 3] Show toast for create errors
  useEffect(() => {
    if (createError) {
      toast.error(createError || 'Failed to create token');
    }
  }, [createError]);

  const handleCreateToken = async () => {
    if (!newTokenLabel.trim()) {
      toast.error('Please enter a token label');
      return;
    }
    
    try {
      await dispatch(createPat(newTokenLabel)).unwrap();
      setNewTokenLabel('');
      setShowCreateModal(false);
      // Show the token modal after creation
      setShowTokenModal(true);
    } catch (error) {
      // Error already handled by useEffect
    }
  };

  const handleCloseTokenModal = () => {
    setShowTokenModal(false);
    dispatch(clearNewlyCreatedToken());
  };

  const handleCopyNewToken = async () => {
    if (newlyCreatedToken?.token) {
      try {
        await navigator.clipboard.writeText(newlyCreatedToken.token);
        toast.success('Token copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy token:', err);
        toast.error('Failed to copy token');
      }
    }
  };

  // Removed copyToken - tokens can't be copied after creation

  const deleteToken = (id) => {
    dispatch(deletePAT(id));
  };

  const mask = () => {
    // Always return masked token (raw token is never stored/shown after creation)
    return '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••';
  };

  // Check if token is expired
  const isTokenExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  // Get time ago format
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  // Get expiry status message
  const getExpiryMessage = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    if (diffDays < 7) return `Expires in ${diffDays} days`;
    if (diffDays < 30) return `Expires in ${Math.floor(diffDays / 7)} weeks`;
    return `Expires in ${Math.floor(diffDays / 30)} months`;
  };

  // Page-level loading state
  if (patStatus === 'loading') return (<LoadingState/>)
    

  // Page-level error state
  else if (patStatus === 'failed') return (<ErrorState 
                                              message={`${ patError}`}
                                              onRetry={() => dispatch(resetPatStatus())} />)
  else return (
    <div className="text-slate-200 h-full flex flex-col p-6 space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Access Tokens
          </h1>
          <p className="text-slate-500 text-xs font-medium">Secure keys for API and CLI access.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-500/10 active:scale-95 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Generate Token
        </button>
      </div>

      {/* Show Token Modal - Shows raw token only once after creation */}
      {showTokenModal && newlyCreatedToken && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d2e] border-2 border-yellow-500/50 rounded-xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Token Created Successfully!</h2>
                  <p className="text-yellow-400 text-sm mt-1">⚠️ Copy this token now - you won't be able to see it again!</p>
                </div>
              </div>
              <button
                onClick={handleCloseTokenModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 p-4 bg-[#0b0d14] border border-yellow-500/30 rounded-lg">
              <label className="block text-sm text-slate-300 mb-2 font-semibold">Your Personal Access Token</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-sm text-yellow-300 break-all select-all">
                  {newlyCreatedToken.token}
                </code>
                <button
                  onClick={handleCopyNewToken}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
              <p className="text-blue-300 text-sm">
                <strong>Important:</strong> This token will not be shown again. Make sure to copy it and store it securely. 
                You can use this token for Git CLI authentication and API access.
              </p>
            </div>

            <button
              onClick={handleCloseTokenModal}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all"
            >
              I've Copied the Token
            </button>
          </div>
        </div>
      )}

      {/* Create Token Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d2e] border border-indigo-500/30 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Create New Token</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewTokenLabel('');
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-slate-400 text-sm mb-4">
              Give your token a descriptive name to help you identify it later.
            </p>

            <div className="mb-6">
              <label className="block text-sm text-slate-300 mb-2">Token Label</label>
              <input
                type="text"
                value={newTokenLabel}
                onChange={(e) => setNewTokenLabel(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateToken()}
                placeholder="e.g., Production API Key"
                className="w-full px-4 py-2 rounded-lg bg-[#0b0d14] border border-indigo-400/20 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-white placeholder-slate-500 transition-all"
                disabled={creating}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewTokenLabel('');
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-800/50 text-slate-300 text-sm font-medium transition-all"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateToken}
                disabled={creating || !newTokenLabel.trim()}
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
                  'Create Token'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tokens List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {patTokens && patTokens.length > 0 ? (
          patTokens.map((token) => {
            const isExpired = isTokenExpired(token.expiresAt);
            const status = isExpired ? 'inactive' : 'active';
            
            return (
            <div 
              key={token._id} 
              className="group relative bg-[#1a1d2e] border border-white/5 rounded-xl p-4 hover:border-indigo-500/40 transition-all duration-200"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {token.label}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      {isExpired ? 'Expired' : getExpiryMessage(token.expiresAt)}
                    </p>
                  </div>

                  {/* Action Icons - Only delete button (token can't be shown/copied after creation) */}
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => deleteToken(token._id)} 
                      disabled={deletingId === token._id}
                      className={`p-2 rounded-lg transition-colors ${
                        deletingId === token._id
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                      title={deletingId === token._id ? 'Deleting...' : 'Delete token'}
                    >
                      {deletingId === token._id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Token Box - Always masked (raw token never shown after creation) */}
                <div className="bg-[#161927] border border-white/5 rounded-lg p-3 font-mono text-sm text-indigo-300/80 flex justify-between items-center group-hover:border-indigo-500/20 transition-all">
                  <span className="truncate pr-4">
                    {mask()}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-600 font-sans uppercase tracking-widest whitespace-nowrap">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {getTimeAgo(token.createdAt)}
                  </div>
                </div>
              </div>
            </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10 text-slate-500 text-sm italic">
            No active tokens found.
          </div>
        )}
      </div>
    </div>
  );
}


export default PatTokenPage;