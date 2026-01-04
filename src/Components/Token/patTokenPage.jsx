import { useState ,useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { getPatTokens, deletePAT ,resetPatStatus ,clearErrors ,createPat} from '../../features/patSlice.js';
import toast from 'react-hot-toast';
import LoadingState from '../Layout/Loading.jsx';
import ErrorState from '../Layout/Error.jsx';
import { ApiError } from '../../../../backend/utils/ApiError.js';
function PatTokenPage() {

  const dispatch = useDispatch();

  
  
  const {
    tokens: patTokens,
    status: patStatus,
    error: patError,
    deletingId,
    actionError
  } = useSelector((state) => state.pat);
     
  const [visible, setVisible] = useState({});

  // 1]]
  useEffect(()=>{
    dispatch(clearErrors())
    if(patStatus==="idle"){
      
      dispatch(getPatTokens());
    }
  }, [ patStatus, dispatch]);

  // 2]Show toast for action errors
  useEffect(() => {
    if (actionError) {
      toast.error(actionError.message || 'Operation failed');
    }
  }, [actionError]);

  const copyToken = async (tokenValue) => {
    if (!tokenValue) {
      toast.error('Token value is not available. Tokens are only visible when first created.');
      return;
    }
    try {
      await navigator.clipboard.writeText(tokenValue);
         toast.success('Token copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy token:', err);
      toast.error('Failed to copy token');
    }
  };

  const deleteToken = (id) => {
    dispatch(deletePAT(id));
  };

  const mask = (v) => {
    if (!v || v.length < 12) return '••••••••••••••••••••••••••••••••';
    return `${v.slice(0, 8)}••••••••••••••${v.slice(-4)}`;
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
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-500/10 active:scale-95 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Generate Token
        </button>
      </div>

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

                  {/* Action Icons (SVG Native) */}
                  <div className="flex items-center gap-1">
                    {token.tokenHash && (
                      <button 
                        onClick={() => setVisible((v) => ({ ...v, [token._id]: !v[token._id] }))} 
                        className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title={visible[token._id] ? "Hide token" : "Show token"}
                      >
                        {visible[token._id] ? 
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg> : 
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        }
                      </button>
                    )}
                    <button 
                      onClick={() => copyToken(token.tokenHash)} 
                      className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      title="Copy token"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 00-2 2z" /></svg>
                    </button>
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

                {/* Token Box */}
                <div className="bg-[#161927] border border-white/5 rounded-lg p-3 font-mono text-sm text-indigo-300/80 flex justify-between items-center group-hover:border-indigo-500/20 transition-all">
                  <span className="truncate pr-4">
                    {token.tokenHash ? (
                      visible[token._id] ? token.tokenHash : mask(token.tokenHash)
                    ) : (
                      <span className="text-slate-500 italic font-sans text-xs">
                        Token value hidden for security
                      </span>
                    )}
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