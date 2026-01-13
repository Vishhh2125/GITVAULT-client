import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getRepoInfo, updateRepo, deleteRepo, resetRepoInfo } from '../../features/repoSlice.js';

function SettingsTab() {
  const { id: repoId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const repo = useSelector(state => state.repos.currentRepo);
  const user = useSelector(state => state.user.user);
  const deleting = useSelector(state => state.repos.deleting);
  
  // Check user permissions
  const isOwner = repo && user && repo.owner._id === user._id;
  const isAdmin = repo && user && repo.collaborators?.some(
    collab => {
      const collabUserId = typeof collab.user === 'object' ? collab.user._id : collab.user;
      return collabUserId === user._id && collab.role === 'admin';
    }
  );
  const isCollaborator = repo && user && repo.collaborators?.some(
    collab => {
      const collabUserId = typeof collab.user === 'object' ? collab.user._id : collab.user;
      return collabUserId === user._id;
    }
  );
  const hasAccess = isOwner || isCollaborator || repo?.visibility === 'public';
  const canEdit = isOwner || isAdmin; // Only owner and admin can edit
  const canDelete = isOwner; // Only owner can delete
  
  const [description, setDescription] = useState(repo?.description || '');
  const [visibility, setVisibility] = useState(repo?.visibility || 'public');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [updatingVisibility, setUpdatingVisibility] = useState(false);
  const [updatingDescription, setUpdatingDescription] = useState(false);

  useEffect(() => {
    if (repo) {
      setDescription(repo.description || '');
      setVisibility(repo.visibility || 'public');
    }
  }, [repo]);

  const handleVisibilityChange = async (newVisibility) => {
    if (!canEdit) {
      toast.error('Only repository owner or admin can update settings');
      return;
    }

    if (newVisibility === visibility) return;

    setUpdatingVisibility(true);
    try {
      await dispatch(updateRepo({repoId, data: {visibility: newVisibility}})).unwrap();
      await dispatch(getRepoInfo(repoId)).unwrap();
      toast.success('Visibility updated successfully');
    } catch (error) {
      toast.error(error || 'Failed to update visibility');
      setVisibility(repo?.visibility || 'public'); // Revert on error
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const handleDescriptionBlur = async () => {
    if (!canEdit) return;
    
    const currentDesc = repo?.description || '';
    if (description === currentDesc) return;

    setUpdatingDescription(true);
    try {
      await dispatch(updateRepo({repoId, data: {description}})).unwrap();
      await dispatch(getRepoInfo(repoId)).unwrap();
      toast.success('Description updated successfully');
    } catch (error) {
      toast.error(error || 'Failed to update description');
      setDescription(currentDesc); // Revert on error
    } finally {
      setUpdatingDescription(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmName !== repo.name) {
      toast.error('Repository name does not match');
      return;
    }

    try {
      await dispatch(deleteRepo(repoId)).unwrap();
      toast.success('Repository deleted successfully');
      navigate('/repositories');
    } catch (error) {
      toast.error(error || 'Failed to delete repository');
    }
  };

  if (!hasAccess) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">You do not have access to view this repository's settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">General</h2>
        <div className="bg-[#0b0d14] border border-white/10 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Repository name
            </label>
            <input
              type="text"
              value={repo.name}
              disabled
              className="w-full bg-black/30 border border-white/10 text-slate-400 rounded-md px-3 py-2 cursor-not-allowed font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Repository names cannot be changed after creation.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              disabled={updatingDescription || !canEdit}
              readOnly={!canEdit}
              className="w-full bg-[#0b0d14] border border-white/10 text-white rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors resize-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              rows={3}
              placeholder="A short description of your repository"
            />
            {updatingDescription && (
              <p className="text-xs text-indigo-400 mt-1.5">Saving...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Visibility
            </label>
            <select 
              value={visibility}
              onChange={(e) => handleVisibilityChange(e.target.value)}
              disabled={updatingVisibility || !canEdit}
              className="w-full bg-[#0b0d14] border border-white/10 text-white rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <p className="text-xs text-slate-500 mt-1.5">
              {visibility === 'public' 
                ? 'Anyone on the internet can see this repository.'
                : 'You choose who can see and commit to this repository.'}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone - Only visible to owner */}
      {canDelete && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-300 mb-4">Danger Zone</h2>
          <div className="bg-[#0b0d14] border border-red-500/10 rounded-lg p-6">
            <h3 className="text-base font-medium text-slate-300 mb-1.5">Delete this repository</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Once you delete a repository, there is no going back. Please be certain.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              Delete this repository
            </button>
          </div>
        </div>
      )}
      
      {/* Info message for non-editors */}
      {hasAccess && !canEdit && (
        <div className="mt-8">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
            <p className="text-sm text-indigo-400">
              You have read-only access to these settings. Only the repository owner and admins can make changes.
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d2e] border border-red-500/30 rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Are you absolutely sure?</h3>
              <p className="text-sm text-slate-400 mb-4">
                This action <strong className="text-red-400">cannot</strong> be undone. This will permanently delete the <strong>{repo.name}</strong> repository, wiki, issues, comments, packages, secrets, workflow runs, and remove all collaborator associations.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                Please type <strong className="text-white font-mono">{repo.name}</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                className="w-full bg-[#0b0d14] border border-white/10 text-white rounded-md px-3 py-2 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-colors text-sm font-mono"
                placeholder={repo.name}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmName('');
                }}
                className="flex-1 px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 rounded-md text-sm font-medium transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || deleteConfirmName !== repo.name}
                className="flex-1 px-4 py-2 bg-red-600/90 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
              >
                {deleting ? 'Deleting...' : 'I understand, delete this repository'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsTab;