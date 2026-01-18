import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Clock } from 'lucide-react';
import { getAllPublicRepos ,resetPublicRepos} from '../../features/repoSlice.js';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const repos = useSelector((state) => state.repos.repos);
  const publicRepos = useSelector((state) => state.repos.publicRepos);
  const publicReposStatus = useSelector((state) => state.repos.publicReposStatus);
  const user = useSelector((state) => state.user.user);

  // Fetch public repos on mount
  useEffect(() => {
    if (publicReposStatus === 'idle') {
      dispatch(getAllPublicRepos());
    }
  }, [dispatch, publicReposStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setSearchQuery('');
      setIsSearching(false);
      setSearchResults([]);
      dispatch(resetPublicRepos())
    };
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      
      // Combine user's repos and all public repos, avoiding duplicates
      const allReposMap = new Map();
      
      // Add user's repos (owned + collaborator)
      repos.forEach(repo => {
        allReposMap.set(repo._id, repo);
      });
      
      // Add public repos (will not override if already exists)
      publicRepos.forEach(repo => {
        if (!allReposMap.has(repo._id)) {
          allReposMap.set(repo._id, repo);
        }
      });
      
      // Convert to array and filter by search query
      const allRepos = Array.from(allReposMap.values());
      const results = allRepos.filter(repo => {
        const matchesSearch = 
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
      });
      
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery, repos, publicRepos, user]);

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

  const getUserRole = (repo) => {
    if (!user || !repo) return null;
    if (repo.owner?._id === user._id || repo.owner === user._id) return 'Owner';
    const collab = repo.collaborators?.find(c => {
      const collabUserId = typeof c.user === 'object' ? c.user._id : c.user;
      return collabUserId === user._id;
    });
    return collab ? collab.role : null;
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  return (
    <div className="relative">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10 group-focus-within:text-indigo-400 transition-colors" />
        <input 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          placeholder="Search all repositories…" 
          className="w-full bg-[#11141d] border border-white/10 text-white pl-12 pr-12 py-3.5 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 hover:border-white/20 shadow-lg" 
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isSearching && (
        <div className="absolute top-full mt-2 w-full bg-[#11141d] border border-white/10 rounded-xl shadow-2xl max-h-[500px] overflow-y-auto z-50 backdrop-blur-sm">
          {searchResults.length > 0 ? (
            <div>
              <div className="p-3 bg-gradient-to-r from-indigo-500/10 to-transparent border-b border-white/10 sticky top-0 backdrop-blur-sm z-10">
                <p className="text-xs text-indigo-400 font-medium">
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                </p>
              </div>
              <div className="divide-y divide-white/5">
                {searchResults.map(repo => {
                  const userRole = getUserRole(repo);
                  const isOwner = repo.owner?._id === user?._id || repo.owner === user?._id;
                  const ownerName = typeof repo.owner === 'object' ? repo.owner.username : 'Unknown';
                  
                  return (
                    <div
                      key={repo._id}
                      onClick={() => {
                        navigate(`/repositories/${repo._id}`);
                        handleClearSearch();
                      }}
                      className="p-4 hover:bg-white/[0.02] transition-all cursor-pointer group/item border-l-2 border-transparent hover:border-indigo-500"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover/item:bg-indigo-500/20 transition-colors mt-0.5">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-white font-semibold group-hover/item:text-indigo-300 transition-colors">
                                {repo.name}
                              </h3>
                              {userRole && (
                                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize whitespace-nowrap">
                                  {userRole}
                                </span>
                              )}
                              {!isOwner && (
                                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/20 whitespace-nowrap">
                                  by {ownerName}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-400 text-sm mb-2 line-clamp-1">
                              {repo.description || 'No description provided'}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {formatTime(repo.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-md capitalize whitespace-nowrap flex-shrink-0 font-medium ${
                            repo.visibility === 'public' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          }`}>
                            {repo.visibility}
                          </span>
                          <svg className="w-4 h-4 text-slate-600 group-hover/item:text-indigo-400 group-hover/item:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-3">
                <Search className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm mb-1">No repositories found</p>
              <p className="text-slate-500 text-xs">Try searching for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
