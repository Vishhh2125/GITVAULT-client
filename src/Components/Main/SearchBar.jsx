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
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
        <input 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          placeholder="Search all repositories…" 
          className="w-full bg-[#0b0d14] border border-white/10 text-white pl-12 pr-12 py-3 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none transition-all duration-200 hover:border-indigo-400/40" 
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isSearching && (
        <div className="absolute top-full mt-2 w-full bg-[#11141d] border border-white/10 rounded-xl shadow-2xl max-h-[500px] overflow-y-auto z-50">
          {searchResults.length > 0 ? (
            <div className="divide-y divide-white/5">
              <div className="p-3 bg-white/[0.02] border-b border-white/10">
                <p className="text-xs text-slate-400">
                  Found {searchResults.length} {searchResults.length === 1 ? 'repository' : 'repositories'}
                </p>
              </div>
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
                    className="block p-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
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
                          {!isOwner && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 whitespace-nowrap">
                              by {ownerName}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-1">
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
            <div className="p-8 text-center">
              <p className="text-slate-400 text-sm">No repositories found matching "{searchQuery}"</p>
              <p className="text-slate-500 text-xs mt-1">Try searching for a different term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
