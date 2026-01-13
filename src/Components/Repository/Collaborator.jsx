import { useEffect, useState } from "react";
import LoadingState from "../Layout/Loading";
import ErrorState from "../Layout/Error";
import { resetCollaborator, getCollaborators, addCollaborator, updateCollaboratorRole, deleteCollaborator } from "../../features/collaboratorSlice";
import { useDispatch,useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';

function CollaboratorsTab() {
  const { id:repoId} = useParams();
  const dispatch = useDispatch();
  const collaborators = useSelector(state => state.collaborators.collaborators);
  const owner = useSelector(state => state.collaborators.owner);
  const isOwner = useSelector(state => state.collaborators.isOwner);
  const isAdmin = useSelector(state => state.collaborators.isAdmin);
  const collaboratorsStatus = useSelector(state => state.collaborators.status);
  const collaboratorsError = useSelector(state => state.collaborators.error);
  const creating = useSelector(state => state.collaborators.creating);
  const createError = useSelector(state => state.collaborators.createError);
  const editingId = useSelector(state => state.collaborators.editingId);
  const deletingId = useSelector(state => state.collaborators.deletingId);
  const actionError = useSelector(state => state.collaborators.actionError);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [newCollaboratorRole, setNewCollaboratorRole] = useState('read');
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editingRole, setEditingRole] = useState('');
     

  useEffect(()=>{
    if(collaboratorsStatus==="idle"){
      dispatch(getCollaborators({repoId}))
    }
    return ()=>{
      dispatch(resetCollaborator());
    }
  },[dispatch,repoId])

  // Show toast for errors
  useEffect(() => {
    if (createError) {
      toast.error(createError);
    }
    if (actionError) {
      toast.error(actionError);
    }
  }, [createError, actionError]);

  const handleAddCollaborator = async () => {
    if (!newCollaboratorEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    if (!newCollaboratorRole) {
      toast.error('Please select a role');
      return;
    }
    
    try {
      await dispatch(addCollaborator({repoId, email: newCollaboratorEmail.trim(), role: newCollaboratorRole})).unwrap();
      await dispatch(getCollaborators({repoId})); // Refresh list
      setNewCollaboratorEmail('');
      setNewCollaboratorRole('read');
      setShowAddModal(false);
      toast.success('Collaborator added successfully!');
    } catch (error) {
      // Error handled by useEffect
    }
  };

  const handleUpdateRole = async (collaboratorId, newRole) => {
    try {
      await dispatch(updateCollaboratorRole({repoId, collaboratorId, role: newRole})).unwrap();
      setEditingRoleId(null);
      toast.success('Role updated successfully!');
    } catch (error) {
      // Error handled by useEffect
    }
  };

  const handleDeleteCollaborator = async (collaboratorId) => {
    if (!window.confirm('Are you sure you want to remove this collaborator?')) {
      return;
    }
    
    try {
      await dispatch(deleteCollaborator({repoId, collaboratorId})).unwrap();
      toast.success('Collaborator removed successfully!');
    } catch (error) {
      // Error handled by useEffect
    }
  };

  const canManageCollaborators = isOwner || isAdmin;

  const getAvatarColor = (index) => {
    const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-green-500', 'bg-blue-500', 'bg-pink-500', 'bg-yellow-500'];
    return colors[index % colors.length];
  };

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'admin':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'write':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'read':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  if (collaboratorsStatus === "loading") {
    return (
        <LoadingState onRetry={() => dispatch(resetCollaborator())} />
    );
  }

  if (collaboratorsStatus === "failed") {
    return (
      <ErrorState message={collaboratorsError} onRetry={() => dispatch(resetCollaborator())} />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Team Members</h3>
          <p className="text-slate-400 text-sm mt-1">{collaborators?.length || 0} collaborators working on this project</p>
        </div>
        {canManageCollaborators && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Collaborator
          </button>
        )}
      </div>

      {/* Add Collaborator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d2e] border border-indigo-500/30 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Add Collaborator</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCollaboratorEmail('');
                  setNewCollaboratorRole('read');
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={newCollaboratorEmail}
                onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCollaborator()}
                placeholder="user@example.com"
                className="w-full px-4 py-2 rounded-lg bg-[#0b0d14] border border-indigo-400/20 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-white placeholder-slate-500 transition-all"
                disabled={creating}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-slate-300 mb-2">Role</label>
              <select
                value={newCollaboratorRole}
                onChange={(e) => setNewCollaboratorRole(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#0b0d14] border border-indigo-400/20 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-white transition-all"
                disabled={creating}
              >
                <option value="read">Read - Can view repository</option>
                <option value="write">Write - Can push changes</option>
                <option value="admin">Admin - Can manage collaborators</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCollaboratorEmail('');
                  setNewCollaboratorRole('read');
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-800/50 text-slate-300 text-sm font-medium transition-all"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCollaborator}
                disabled={creating || !newCollaboratorEmail.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Collaborator'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {/* Owner Card */}
        {owner && (
          <div className="group flex items-center justify-between p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl">
            <div className="flex items-center gap-5">
              <div className={`relative w-14 h-14 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                {owner.username?.charAt(0).toUpperCase() || 'O'}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 border-2 border-[#0b0d14] rounded-full"></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-semibold text-lg">{owner.username || 'Unknown'}</h4>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 uppercase">
                    Owner
                  </span>
                </div>
                <p className="text-slate-400 text-sm flex items-center gap-2 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {owner.email || 'No email'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Collaborators List */}
        {collaborators && collaborators.length > 0 ? collaborators.map((collab, index) => {
          const isEditing = editingRoleId === collab._id;
          const isDeleting = deletingId === collab._id;
          
          return (
            <div key={collab._id || collab.user?._id || index} className="group flex items-center justify-between p-5 bg-gradient-to-br from-[#0b0d14] to-[#161927] border border-white/10 rounded-xl hover:border-indigo-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10">
              <div className="flex items-center gap-5">
                <div className={`relative w-14 h-14 rounded-xl ${getAvatarColor(index)} flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform`}>
                  {collab.user?.username?.charAt(0).toUpperCase() || 'U'}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0b0d14] rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg group-hover:text-indigo-300 transition-colors">{collab.user?.username || 'Unknown'}</h4>
                  <p className="text-slate-400 text-sm flex items-center gap-2 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {collab.user?.email || 'No email'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <select
                    value={editingRole}
                    onChange={(e) => setEditingRole(e.target.value)}
                    onBlur={() => {
                      if (editingRole && editingRole !== collab.role) {
                        handleUpdateRole(collab._id, editingRole);
                      } else {
                        setEditingRoleId(null);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        if (editingRole && editingRole !== collab.role) {
                          handleUpdateRole(collab._id, editingRole);
                        } else {
                          setEditingRoleId(null);
                        }
                      }
                      if (e.key === 'Escape') {
                        setEditingRoleId(null);
                      }
                    }}
                    autoFocus
                    className="px-3 py-2 rounded-lg bg-[#0b0d14] border border-indigo-400/20 text-white text-sm focus:outline-none focus:border-indigo-400"
                  >
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold border uppercase ${getRoleBadgeStyle(collab.role)}`}>
                    {collab.role}
                  </span>
                )}
                {canManageCollaborators && (
                  <div className="flex items-center gap-1">
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditingRoleId(collab._id);
                          setEditingRole(collab.role);
                        }}
                        disabled={isDeleting}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-indigo-400"
                        title="Change role"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCollaborator(collab._id)}
                      disabled={isDeleting || isEditing}
                      className={`p-2 rounded-lg transition-colors ${
                        isDeleting
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                      title={isDeleting ? 'Removing...' : 'Remove collaborator'}
                    >
                      {isDeleting ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-12">
            <div className="p-4 bg-slate-500/10 rounded-full w-fit mx-auto mb-4">
              <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No collaborators yet</h3>
            <p className="text-slate-400 text-sm">Invite team members to collaborate on this repository</p>
          </div>
        )}
        
        {canManageCollaborators && (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full p-6 border-2 border-dashed border-white/20 rounded-xl text-slate-300 hover:text-indigo-300 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-200 flex items-center justify-center gap-3 font-semibold group"
          >
            <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span>Invite Team Member</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default CollaboratorsTab;