import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, clearError } from '../../features/userSlice.js';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginStatus = useSelector((state) => state.user.loginStatus);
  const userError   = useSelector((state) => state.user.error);

  const isLoading = loginStatus === "loading";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } 
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(loginUser(formData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (userError) {
      dispatch(clearError());
    }
  };

  useEffect(() => {
    if (loginStatus === "succeeded") {
      setFormData({ email: "", password: "" });
      setErrors({});
      navigate("/dashboard", { replace: true });

    }
  }, [loginStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e1018] to-[#0b0d14] text-white flex items-center justify-center relative">
      {/* Dotted Grid Background */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(129, 140, 248, 0.6) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div className="w-full max-w-md rounded-xl bg-[#121421]/80 backdrop-blur-sm border border-indigo-400/25 p-8 relative z-10 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="w-10 h-10 mx-auto mb-4 rounded-lg border border-indigo-400 text-indigo-400 flex items-center justify-center font-bold hover:bg-indigo-400/10 hover:scale-110 transition-all duration-300 cursor-pointer">
            G
          </div>
          <h1 className="text-2xl font-semibold">Sign in to GitVault</h1>
          <p className="text-slate-400 text-sm mt-2">Access your repositories securely</p>
          {userError && <p className="text-red-400 text-sm mt-2">{userError}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Username or Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md bg-[#0b0d14] border ${
                errors.email ? 'border-red-500' : 'border-indigo-400/20'
              } focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 hover:border-indigo-400/40 transition-all duration-200`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 pr-10 rounded-md bg-[#0b0d14] border ${
                  errors.password ? 'border-red-500' : 'border-indigo-400/20'
                } focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 hover:border-indigo-400/40 transition-all duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-slate-400 cursor-pointer hover:text-slate-300">
              <input type="checkbox" className="mr-2 rounded border-indigo-400/20 bg-[#0b0d14] text-indigo-400 focus:ring-indigo-400/20" />
              Remember me
            </label>
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-indigo-400/25 bg-indigo-400/10 text-indigo-400 hover:bg-indigo-400/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <span aria-hidden>→</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account? <a href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">Create one</a>
        </p>
      </div>
    </div>
  );
}
