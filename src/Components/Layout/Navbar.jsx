import { useState, useEffect } from 'react';

export default function Navbar() {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Welcome, Vishnu';
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // Speed of typing (100ms per character)

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <nav className="bg-[#1a1d2e] border-b border-indigo-400/20 px-6 py-3">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-indigo-400 text-indigo-400 flex items-center justify-center font-bold text-lg hover:bg-indigo-400/10 transition-all duration-300 cursor-pointer">
            G
          </div>
          <span className="text-xl font-semibold text-white">GitVault</span>
        </div>

        {/* Welcome Message */}
        <div className="flex-1 flex justify-center">
          <span className="text-lg text-indigo-400 font-medium">
            {displayText}
            <span className="animate-pulse">|</span>
          </span>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all duration-200 relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-400 rounded-full"></span>
          </button>

          {/* Profile Avatar */}
          <button className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold hover:scale-110 transition-transform duration-200">
            U
          </button>
        </div>
      </div>
    </nav>
  );
}
