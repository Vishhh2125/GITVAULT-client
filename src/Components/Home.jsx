import {useEffect} from "react";
import { ArrowRight, Shield, GitBranch, Users, Lock, Terminal, Code2, Server, Zap, GitFork } from "lucide-react";
import { useDispatch,useSelector } from "react-redux";
import { use } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser} from "../features/userSlice.js";
export default function Home() {

  const dispatch=useDispatch();

   useEffect(() => {
     if(localStorage.getItem("token")){

      dispatch(logoutUser())

     }
   }, [dispatch]);


  return (
    <div className="min-h-screen bg-[#0b0e14] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none" />
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b0e14]/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <GitFork className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">GitVault</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Features</a>
              <a href="#workflow" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">How It Works</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="px-5 py-2 text-sm text-slate-300 hover:text-white transition-colors font-medium"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="px-5 py-2.5 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="text-center mb-24 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Secure · Self-Hosted · Developer First
          </div>

          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Git Infrastructure
            <span className="block mt-3">
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-400 bg-clip-text text-transparent">Built for Engineers</span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            GitVault is a secure, self-hosted Git platform designed for teams who care about
            control, performance, and clean workflows. Manage repositories, permissions,
            and access tokens without compromise.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <a
              href="/register"
              className="group px-8 py-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/login"
              className="px-8 py-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold hover:bg-white/10 transition-all active:scale-95"
            >
              Sign In
            </a>
          </div>

          {/* Terminal Demo */}
          <div className="max-w-3xl mx-auto">
            <div className="rounded-xl border border-white/10 bg-[#11141d] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-slate-500 font-medium">terminal</div>
                <div className="w-16" />
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <span className="text-indigo-400">$</span>
                  <span>git clone https://gitvault.local/username/repo.git</span>
                </div>
                <div className="text-slate-400 ml-4 my-2">Cloning into 'repo'...</div>
                <div className="text-slate-400 ml-4">remote: Counting objects: 342, done.</div>
                <div className="text-slate-400 ml-4">remote: Compressing objects: 100%</div>
                <div className="flex items-center gap-2 text-green-400 ml-4 mt-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Authentication via PAT successful
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Why GitVault?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need for secure, professional Git hosting
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Feature
              icon={<Shield className="w-7 h-7" />}
              title="Security First"
              description="Role-based access, PAT authentication, and secure Git operations built into the core."
            />
            <Feature
              icon={<GitBranch className="w-7 h-7" />}
              title="Git-Native"
              description="Designed around real Git workflows — clone, fetch, push, branches, and tags."
            />
            <Feature
              icon={<Users className="w-7 h-7" />}
              title="Team Ready"
              description="Collaborate with fine-grained permissions across users and repositories."
            />
            <Feature
              icon={<Lock className="w-7 h-7" />}
              title="Access Control"
              description="Manage tokens, permissions, and repository visibility with confidence."
            />
          </div>
        </section>

        {/* Built for Control Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Built for Control</h2>
            <p className="text-slate-400 text-lg mb-6 leading-relaxed">
              GitVault gives you full ownership of your source code infrastructure.
              No third-party lock-in, no hidden processes — just clean Git hosting
              with modern APIs and authentication.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Whether you are building internal tools, managing private projects,
              or learning how Git platforms work under the hood, GitVault keeps
              everything transparent and predictable.
            </p>
            <a
              href="/register"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors group"
            >
              Start Building
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-[#11141d] to-[#0f1119] border border-white/10 p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Core Features</span>
            </div>
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Server className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium text-white mb-0.5">Self-hosted Git server</div>
                  <div className="text-xs text-slate-500">Complete control over your infrastructure</div>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Lock className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium text-white mb-0.5">JWT-secured REST APIs</div>
                  <div className="text-xs text-slate-500">Modern authentication and authorization</div>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium text-white mb-0.5">PAT-based CLI authentication</div>
                  <div className="text-xs text-slate-500">Secure token-based Git operations</div>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Shield className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium text-white mb-0.5">Repository-level permissions</div>
                  <div className="text-xs text-slate-500">Fine-grained access control</div>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium text-white mb-0.5">Clean, minimal developer UI</div>
                  <div className="text-xs text-slate-500">Focus on what matters most</div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* How It Works */}
        <section id="workflow" className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Simple Workflow</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Get started in minutes. GitVault integrates seamlessly with your existing Git workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Step
              number="01"
              title="Create Repository"
              description="Set up a new repository through the web interface or API with custom access controls."
            />
            <Step
              number="02"
              title="Generate Token"
              description="Create a Personal Access Token (PAT) for secure CLI authentication and automation."
            />
            <Step
              number="03"
              title="Push & Collaborate"
              description="Use standard Git commands. Invite collaborators and manage permissions as needed."
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-20 px-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-[#11141d] border border-indigo-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to take control?
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Start using GitVault today and experience a Git platform designed
              with clarity, security, and developers in mind.
            </p>
            <a
              href="/register"
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95"
            >
              Create Your Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="group rounded-xl bg-[#11141d] border border-white/5 p-6 hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-indigo-500/5">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-4 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-200">
        <div className="text-indigo-400">{icon}</div>
      </div>
      <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="relative bg-[#11141d] border border-white/5 rounded-xl p-8 hover:border-indigo-500/20 transition-all shadow-lg">
      <div className="absolute -top-4 left-8">
        <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <span className="text-lg font-bold text-indigo-400">{number}</span>
        </div>
      </div>
      <div className="pt-4">
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
