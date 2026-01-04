import React, { useState } from 'react';

export default function Settings() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profile] = useState({
    name: 'Vishnu',
    email: 'vishnu@example.com'
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="md:col-span-2 bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300">
                    {profile.name}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <div className="md:col-span-2 bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300">
                    {profile.email}
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

                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]">
                      Update Password
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
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all">
                  Logout
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#11141d] border border-red-500/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-red-500/10 bg-red-500/[0.02]">
                <h2 className="text-sm font-bold text-red-400 uppercase tracking-[0.2em]">Danger Zone</h2>
                <p className="text-slate-500 text-xs mt-1">Irreversible account actions.</p>
              </div>
              <div className="p-8 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-red-400 mb-1">Delete Account</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Once you delete your account, there is no going back. This will permanently delete your account, 
                    all repositories, tokens, and associated data. This action cannot be undone.
                  </p>
                </div>
                <button className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-6 py-2.5 rounded-xl text-sm font-bold transition-all">
                  Delete Account
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
