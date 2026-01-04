import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getRepos,resetRepoStatus } from '../../features/repoSlice.js';
import LoadingState from '../Layout/Loading.jsx';
import ErrorState from '../Layout/Error.jsx';
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const diffInDays = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(diffInDays, 'day');
};

export default function RepositoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  //all redux state  
  const repoError = useSelector((state) => state.repos.error);
  const repos = useSelector((state) => state.repos.repos);
  const repoStatus = useSelector((state) => state.repos.status);

  useEffect(() => {
    if ( repoStatus === "idle") {
      dispatch(getRepos());
    }
  }, [dispatch, repoStatus]);

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );


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
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap">
          + New Repository
        </button>
      </div>

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

      {/* SLIM REPOSITORY LIST: Reduced padding and gap */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {filteredRepos.length > 0 ? (
          filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="group relative bg-[#1a1d2e] border border-white/5 rounded-xl p-4 hover:border-indigo-500/30 transition-all duration-200 cursor-pointer hover:bg-[#1e2235]"
            >
              {/* Thinner accent bar */}
              <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-indigo-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                      {repo.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-tighter font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {repo.visibility}
                    </span>
                  </div>
                  
                  {/* Inline metadata to save vertical space */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <p className="truncate max-w-[300px] text-slate-400">
                      {repo.description || "No description provided."}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>TypeScript</span>
                    </div>
                    <span>Updated {formatTime(repo.updatedAt)}</span>
                  </div>
                </div>

                {/* Smaller icon on the right */}
                <div className="hidden sm:flex p-2 rounded-lg bg-white/5 group-hover:bg-indigo-500/10 transition-colors">
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <div className="text-slate-500 text-sm italic">No repositories found</div>
          </div>
        )}
      </div>
    </div>
  );
}