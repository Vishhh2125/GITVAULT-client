

import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({
  apiKey: `${import.meta.env.VITE_GEMINI_API_KEY}`,
});

const SYSTEM_CONTEXT = `You are GitVault AI Assistant, a practical helper for developers.

ROLE:
Help users with GitVault platform usage:
PATs, repositories, collaborators, CLI, APIs, and workflows.

DEFAULT BEHAVIOR:
- Keep answers short and direct (3–5 bullets)
- Do NOT explain concepts unless asked

WHEN TO EXPLAIN IN DETAIL:
Only give step-by-step explanations if the user asks:
"how", "how to use", "explain", "why", "step by step"

GREETING RULE:
If the user greets (hi/hello/hey), reply with ONE short line and ask what they need.

SECURITY:
- Never show real tokens
- Never ask for secrets
- Use placeholders like <TOKEN>

STYLE:
- Clear
- Practical
- No unnecessary text
`

async function askGitVaultAI(userQuestion, chatHistory = []) {
  try {
    const contents = [
      { role: "user", parts: [{ text: SYSTEM_CONTEXT }] },
      ...chatHistory.map(msg => ({
        role: msg.from === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      { role: "user", parts: [{ text: userQuestion }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
    });

    // Handle different response formats
    if (response && response.text) {
      return typeof response.text === 'function' ? response.text() : response.text;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

function ChatBot() {
  const [showHint, setShowHint] = useState(true);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi! Ask me anything about GitVault 🚀' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const chatHistory = messages.slice(1); // Exclude initial greeting
      const aiResponse = await askGitVaultAI(userMessage, chatHistory);
      setMessages(prev => [...prev, { from: 'bot', text: aiResponse }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-12 flex flex-col items-end gap-3 z-50">
      {showHint && !open && (
        <div onClick={() => setOpen(true)} className="bg-indigo-600/90 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-bounce cursor-pointer hover:bg-indigo-600 transition-colors">
          👋 Need help using GitVault?
        </div>
      )}

      {open && (
        <div className="w-[480px] bg-[#11141d] border border-white/10 rounded-xl shadow-2xl flex flex-col mb-2 backdrop-blur-sm">
          <div className="p-4 border-b border-white/10 text-white font-semibold bg-white/[0.02] flex items-center justify-between">
            <span>GitVault Assistant</span>
            <button 
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[450px] min-h-[250px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  m.from === 'user' 
                    ? 'bg-indigo-600/20 text-indigo-300 rounded-br-none' 
                    : 'bg-white/5 text-slate-300 rounded-bl-none'
                }`}>
                  {m.from === 'bot' ? (
                    <ReactMarkdown 
                      components={{
                        p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                        li: ({children}) => <li className="text-slate-300">{children}</li>,
                        strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                        code: ({children}) => <code className="bg-black/30 px-1 py-0.5 rounded text-indigo-300">{children}</code>,
                        h1: ({children}) => <h1 className="text-base font-bold mb-2 text-white">{children}</h1>,
                        h2: ({children}) => <h2 className="text-sm font-bold mb-1 text-white">{children}</h2>,
                        h3: ({children}) => <h3 className="text-sm font-semibold mb-1 text-white">{children}</h3>,
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-white/5 text-slate-300 rounded-bl-none">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t border-white/10 flex gap-2 bg-white/[0.02]">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && !isLoading && sendMessage()} 
              placeholder="Type a message..." 
              disabled={isLoading}
              className="flex-1 bg-[#0b0d14] border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading}
              className="bg-indigo-600/80 hover:bg-indigo-600 px-4 py-2 text-sm text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => { setOpen(!open); setShowHint(false); }} 
        className="bg-indigo-600/90 hover:bg-indigo-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors text-sm font-medium"
      >
        💬  Help
      </button>
    </div>
  );
}

export default ChatBot;