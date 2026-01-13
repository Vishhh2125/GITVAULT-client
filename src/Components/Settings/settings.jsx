import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser, changePassword ,resetLogoutStatus } from '../../features/userSlice.js';
import toast from 'react-hot-toast';

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  const logoutStatus = useSelector(state => state.user.logoutStatus);
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (logoutStatus === 'succeeded'  ) {
      navigate('/login');
    }
  }, [logoutStatus, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetLogoutStatus());
    };
  }, [dispatch]);

  const handlePasswordChange = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await dispatch(changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      })).unwrap();
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error || 'Failed to logout');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="text-slate-200 min-h-full bg-[#0b0e14] relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-10 p-8">
        <div className="max-w-3xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="pb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your GitVault account security and view profile details.</p>
          </div>

          <div className="space-y-6">
            
            {/* Account Info Card */}
            <div className="bg-[#11141d] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em]">Account Info</h2>
                <p className="text-slate-500 text-xs mt-1">Identity details cannot be changed once the vault is created.</p>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Username</label>
                  <div className="md:col-span-2 bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300">
                    {user.username || 'N/A'}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <div className="md:col-span-2 bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300">
                    {user.email || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-[#11141d] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em]">Security</h2>
                <p className="text-slate-500 text-xs mt-1">Manage your authentication credentials.</p>
              </div>
              
              <div className="p-8">
                {!isChangingPassword ? (
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                      <div className="text-sm text-white tracking-[0.3em]">••••••••••••</div>
                    </div>
                    <button 
                      onClick={() => setIsChangingPassword(true)}
                      className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Update Credentials</h3>
                      <button 
                        onClick={() => setIsChangingPassword(false)}
                        className="text-slate-400 hover:text-white text-xs font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter current password"
                        value={passwordData.oldPassword}
                        className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all outline-none"
                        onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={passwordData.newPassword}
                          className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all outline-none"
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={passwordData.confirmPassword}
                          className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all outline-none"
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handlePasswordChange}
                      disabled={changingPassword}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
                    >
                      {changingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Session Card */}
            <div className="bg-[#11141d] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em]">Session</h2>
                <p className="text-slate-500 text-xs mt-1">Manage your active session.</p>
              </div>
              <div className="p-8 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-white font-medium">Active Session</p>
                  <p className="text-xs text-slate-500">You are currently signed in to GitVault</p>
                </div>
                <button 
                  onClick={handleLogout}
                  disabled={logoutStatus === 'loading'}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {logoutStatus === 'loading' ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#11141d] border border-red-500/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-red-500/10 bg-red-500/[0.02]">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Danger Zone</h2>
                <p className="text-slate-500 text-xs mt-1">Irreversible account actions.</p>
              </div>
              <div className="p-8 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-1">Delete Account</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Once you delete your account, there is no going back. This will permanently delete your account, 
                    all repositories, tokens, and associated data. This action cannot be undone.
                  </p>
                </div>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600/80 hover:bg-red-600 text-white border border-red-500/20 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#1a1d2e] border border-red-500/30 rounded-lg max-w-md w-full p-6 shadow-2xl">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">Are you absolutely sure?</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      This action <strong className="text-red-400">cannot</strong> be undone. This will permanently delete your account, all repositories, tokens, and associated data.
                    </p>
                    <p className="text-sm text-slate-300 mb-2">
                      Please type <strong className="text-white font-mono">DELETE</strong> to confirm:
                    </p>
                    <input
                      type="text"
                      className="w-full bg-[#0b0d14] border border-white/10 text-white rounded-md px-3 py-2 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-colors text-sm font-mono"
                      placeholder="DELETE"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 rounded-md text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      disabled
                      className="flex-1 px-4 py-2 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
                    >
                      Delete Account (Coming Soon)
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
