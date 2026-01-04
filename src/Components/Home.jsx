import React from "react";
import { ArrowRight, Shield, GitBranch, Users, Lock, Terminal, Code2, Server, Zap, GitFork } from "lucide-react";
import { useDispatch,useSelector } from "react-redux";
import { getRepos } from "../features/repoSlice.js";
export default function Home() {




  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e1018] to-[#0b0d14] text-white">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0d14]/80 border-b border-indigo-400/25">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <GitFork className="w-6 h-6 text-indigo-400" />
              <span className="text-xl font-semibold">GitVault</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#workflow" className="text-slate-400 hover:text-white transition-colors">How It Works</a>
              <a href="#docs" className="text-slate-400 hover:text-white transition-colors">Docs</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="px-4 py-2 text-sm rounded-lg border border-indigo-400/25 bg-indigo-400/10 text-indigo-400 hover:bg-indigo-400/15 hover:border-indigo-400/40 transition-all"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <section className="text-center mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-400/25 text-indigo-400 text-sm mb-8 backdrop-blur-sm">
            Secure · Self-Hosted · Developer First
          </div>

          <h1 className="text-7xl font-bold leading-tight mb-6 tracking-tight">
            Git Infrastructure
            <span className="block text-indigo-400 mt-2">Built for Engineers</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            GitVault is a secure, self-hosted Git platform designed for teams who care about
            control, performance, and clean workflows. Manage repositories, permissions,
            and access tokens without compromise.
          </p>

          <div className="flex justify-center gap-4 mb-16">
            <a
              href="/register"
              className="group px-8 py-3 rounded-lg border border-indigo-400/25 bg-indigo-400/10 text-indigo-400 font-medium flex items-center gap-2 hover:bg-indigo-400/15 hover:border-indigo-400/40 transition-all"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="/login"
              className="px-8 py-3 rounded-lg border border-indigo-400/15 text-white hover:border-indigo-400/30 hover:bg-indigo-400/5 transition-all"
            >
              Sign In
            </a>
          </div>

          {/* Terminal Demo */}
          <div className="max-w-2xl mx-auto">
            <div className="rounded-lg border border-indigo-400/25 bg-[#121421] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-indigo-400/25">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                </div>
                <div className="text-xs text-slate-500 ml-2">terminal</div>
              </div>
              <div className="p-4 font-mono text-sm">
                <div className="text-slate-500">$ git clone https://gitvault.local/username/repo.git</div>
                <div className="text-slate-400 mt-2">Cloning into 'repo'...</div>
                <div className="text-slate-400">remote: Counting objects: 342</div>
                <div className="text-indigo-400 mt-2">✓ Authentication via PAT successful</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
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
        </section>

        {/* Built for Control Section */}
        <section className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <h2 className="text-4xl font-semibold mb-6 tracking-tight">Built for Control</h2>
            <p className="text-slate-400 text-lg mb-6 leading-relaxed">
              GitVault gives you full ownership of your source code infrastructure.
              No third-party lock-in, no hidden processes — just clean Git hosting
              with modern APIs and authentication.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              Whether you are building internal tools, managing private projects,
              or learning how Git platforms work under the hood, GitVault keeps
              everything transparent and predictable.
            </p>
          </div>

          <div className="rounded-xl bg-[#121421] border border-indigo-400/25 p-8">
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-start gap-3">
                <Server className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>Self-hosted Git server</span>
              </li>
              <li className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>JWT-secured REST APIs</span>
              </li>
              <li className="flex items-start gap-3">
                <Terminal className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>PAT-based CLI authentication</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>Repository-level permissions</span>
              </li>
              <li className="flex items-start gap-3">
                <Code2 className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>Clean, minimal developer UI</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Technical Stack Section */}
        <section className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold mb-4 tracking-tight">Developer-Grade Infrastructure</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Built with modern tools and best practices for reliability and performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TechCard
              icon={<Zap className="w-6 h-6" />}
              title="Fast & Lightweight"
              description="Optimized Git operations with minimal overhead. No bloat, just what you need."
            />
            <TechCard
              icon={<Terminal className="w-6 h-6" />}
              title="CLI-First Approach"
              description="Designed for developers who live in the terminal. Git commands work exactly as expected."
            />
            <TechCard
              icon={<Code2 className="w-6 h-6" />}
              title="REST API Access"
              description="Programmatic access to all features. Build custom integrations and automation."
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold mb-4 tracking-tight">Simple Workflow</h2>
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
        <section className="text-center py-16 rounded-2xl border border-indigo-400/25 bg-[#121421]">
          <h2 className="text-4xl font-semibold mb-6 tracking-tight">Ready to take control?</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Start using GitVault today and experience a Git platform designed
            with clarity, security, and developers in mind.
          </p>
          <a
            href="/register"
            className="group inline-flex items-center gap-2 px-10 py-4 rounded-lg border border-indigo-400/25 bg-indigo-400/10 text-indigo-400 font-medium hover:bg-indigo-400/15 hover:border-indigo-400/40 transition-all"
          >
            Create Your Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </section>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="group rounded-xl bg-[#121421] border border-indigo-400/25 p-6 hover:border-indigo-400/40 transition-all">
      <div className="text-indigo-400 mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function TechCard({ icon, title, description }) {
  return (
    <div className="rounded-xl bg-[#121421] border border-indigo-400/25 p-6 hover:border-indigo-400/40 transition-all">
      <div className="text-indigo-400 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="relative">
      <div className="text-6xl font-bold text-indigo-400/20 mb-4">{number}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
