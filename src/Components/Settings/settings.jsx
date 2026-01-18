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
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Settings</h1>
            <p className="text-slate-500 text-sm">Manage your GitVault account security and view profile details.</p>
          </div>

          <div className="space-y-6">
            
            {/* Account Info Card */}
            <div className="bg-[#11141d] border border-white/5 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-gradient-to-r from-indigo-500/5 to-transparent">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h2 className="text-base font-bold text-white">Account Information</h2>
                </div>
                <p className="text-slate-400 text-xs mt-2">Your identity details are permanent and cannot be modified</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 hover:border-indigo-500/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1.5">Username</label>
                      <div className="text-white font-medium">
                        {user.username || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 hover:border-indigo-500/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1.5">Email Address</label>
                      <div className="text-white font-medium">
                        {user.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-[#11141d] border border-white/5 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-gradient-to-r from-green-500/5 to-transparent">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h2 className="text-base font-bold text-white">Security & Authentication</h2>
                </div>
                <p className="text-slate-400 text-xs mt-2">Manage your authentication credentials</p>
              </div>
              
              <div className="p-6">
                {!isChangingPassword ? (
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5 hover:border-green-500/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mt-0.5">
                          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1.5">Password</label>
                          <div className="text-white font-medium tracking-[0.3em]">••••••••••••</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsChangingPassword(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Change Password
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5">
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <h3 className="text-sm font-semibold text-white">Update Password</h3>
                      </div>
                      <button 
                        onClick={() => setIsChangingPassword(false)}
                        className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-slate-300 block mb-2">Current Password</label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <input 
                            type="password" 
                            placeholder="Enter current password"
                            value={passwordData.oldPassword}
                            className="w-full bg-[#0b0e14] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all outline-none"
                            onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-300 block mb-2">New Password</label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                              </svg>
                            </div>
                            <input 
                              type="password" 
                              placeholder="Min. 6 characters"
                              value={passwordData.newPassword}
                              className="w-full bg-[#0b0e14] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all outline-none"
                              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-300 block mb-2">Confirm Password</label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <input 
                              type="password" 
                              placeholder="Re-enter password"
                              value={passwordData.confirmPassword}
                              className="w-full bg-[#0b0e14] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all outline-none"
                              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button 
                          onClick={() => setIsChangingPassword(false)}
                          className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white text-sm font-medium transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handlePasswordChange}
                          disabled={changingPassword}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                          {changingPassword ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Update Password
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Session Card */}
            <div className="bg-[#11141d] border border-white/5 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-gradient-to-r from-indigo-500/5 to-transparent">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-base font-bold text-white">Active Session</h2>
                </div>
                <p className="text-slate-400 text-xs mt-2">Manage your current login session</p>
              </div>
              <div className="p-6">
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5 hover:border-indigo-500/20 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mt-0.5">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-white font-semibold mb-1">Currently Signed In</p>
                        <p className="text-xs text-slate-400">You are authenticated to GitVault</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      disabled={logoutStatus === 'loading'}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                    >
                      {logoutStatus === 'loading' ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Logging out...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#11141d] border border-white/5 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h2 className="text-base font-bold text-white">Danger Zone</h2>
                </div>
                <p className="text-slate-400 text-xs mt-2">Irreversible account actions</p>
              </div>
              <div className="p-6">
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5 hover:border-white/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mt-0.5">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white mb-2">Delete Account</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        Once you delete your account, there is no going back. This will permanently delete your account, all repositories, tokens, and associated data.
                      </p>
                      <button 
                        onClick={() => setShowDeleteModal(true)}
                        className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#11141d] border border-red-500/30 rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500/10 to-transparent p-6 border-b border-red-500/20">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">Delete Account?</h3>
                        <p className="text-xs text-slate-400">This action is permanent and irreversible</p>
                      </div>
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mb-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        This will <span className="text-red-400 font-semibold">permanently delete</span> your account, all repositories, tokens, and associated data. This action <span className="text-red-400 font-semibold">cannot be undone</span>.
                      </p>
                    </div>
                    
                    <div className="mb-5">
                      <label className="text-xs font-medium text-slate-300 block mb-2">
                        Type <span className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10">DELETE</span> to confirm:
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[#0b0e14] border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-mono"
                        placeholder="DELETE"
                        autoFocus
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="flex-1 px-4 py-2.5 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        disabled
                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Coming Soon
                      </button>
                    </div>
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
