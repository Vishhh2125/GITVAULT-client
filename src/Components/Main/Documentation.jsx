import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Copy, Check, ArrowUp } from 'lucide-react';

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedSections, setExpandedSections] = useState({});
  const [copiedCode, setCopiedCode] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navigationItems = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'authentication', label: 'Authentication' },
    { id: 'pat-tokens', label: 'Personal Access Tokens' },
    { id: 'repository-management', label: 'Repository Management' },
    { id: 'file-browsing', label: 'File Browsing' },
    { id: 'collaboration', label: 'Collaboration' },
    { id: 'search-discovery', label: 'Search & Discovery' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'ai-assistant', label: 'AI Assistant' },
    { id: 'cli-usage', label: 'CLI Usage' },
    { id: 'settings', label: 'Settings' },
    { id: 'security', label: 'Security Best Practices' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-full bg-[#0b0e14] relative text-slate-200">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-10 flex">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 fixed h-screen overflow-y-auto border-r border-white/5 bg-[#11141d]/50 backdrop-blur-sm">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-2 text-white">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-bold">Documentation</h2>
            </div>
          </div>
          <nav className="p-4">
            <ul className="space-y-1">
              {navigationItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === item.id
                        ? 'bg-indigo-500/20 text-indigo-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">GitVault Documentation</h1>
              <p className="text-slate-400 text-lg">
                Complete guide to using GitVault - your modern Git repository management platform
              </p>
            </div>

            {/* Getting Started */}
            <Section id="getting-started" title="Getting Started">
              <SubSection title="What is GitVault?">
                <p className="text-slate-300 mb-4">
                  GitVault is a modern web-based Git repository management platform that provides an intuitive interface 
                  for managing your Git repositories, collaborating with teams, and browsing code with advanced syntax highlighting.
                </p>
              </SubSection>

              <SubSection title="Key Features">
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Full repository management (create, view, update, delete)</li>
                  <li>Advanced collaboration with role-based permissions (Read, Write, Admin)</li>
                  <li>Read-only file browsing with Monaco code editor</li>
                  <li>Personal Access Token (PAT) generation for CLI/API access</li>
                  <li>Global repository search across public and private repos</li>
                  <li>AI-powered assistant for platform help</li>
                  <li>Security dashboard with health scoring</li>
                  <li>Git CLI integration via PAT tokens</li>
                </ul>
              </SubSection>

              <SubSection title="System Requirements">
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                  <li>Git installed locally (for CLI operations)</li>
                  <li>Active internet connection</li>
                </ul>
              </SubSection>
            </Section>

            {/* Authentication */}
            <Section id="authentication" title="Authentication">
              <SubSection title="Creating an Account">
                <p className="text-slate-300 mb-4">
                  To get started with GitVault, you'll need to create an account:
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-2 mb-4">
                  <li>Navigate to the registration page</li>
                  <li>Enter your username, email, and password</li>
                  <li>Click "Create Account"</li>
                  <li>You'll be automatically logged in</li>
                </ol>
              </SubSection>

              <SubSection title="Logging In">
                <p className="text-slate-300 mb-4">
                  Access your account using your email and password:
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-2">
                  <li>Go to the login page</li>
                  <li>Enter your email and password</li>
                  <li>Click "Sign In"</li>
                  <li>You'll be redirected to your dashboard</li>
                </ol>
              </SubSection>

              <SubSection title="Session Management">
                <p className="text-slate-300 mb-4">
                  GitVault uses JWT-based authentication with access and refresh tokens. Your session is automatically 
                  maintained, and you'll be logged out after a period of inactivity.
                </p>
              </SubSection>

              <SubSection title="Changing Password">
                <p className="text-slate-300 mb-4">
                  To change your password:
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-2">
                  <li>Go to Settings page</li>
                  <li>Navigate to "Change Password" section</li>
                  <li>Enter your current password</li>
                  <li>Enter and confirm your new password</li>
                  <li>Click "Change Password"</li>
                </ol>
              </SubSection>
            </Section>

            {/* PAT Tokens */}
            <Section id="pat-tokens" title="Personal Access Tokens (PAT)">
              <SubSection title="What are PAT Tokens?">
                <p className="text-slate-300 mb-4">
                  Personal Access Tokens are secure authentication credentials that allow you to access GitVault via 
                  the CLI or API without using your password. They're essential for Git operations from the command line.
                </p>
              </SubSection>

              <SubSection title="Generating a Token">
                <ol className="list-decimal list-inside text-slate-300 space-y-2 mb-4">
                  <li>Navigate to "Manage Tokens" from the sidebar</li>
                  <li>Click "Generate New Token"</li>
                  <li>Enter a descriptive label (e.g., "My Laptop CLI")</li>
                  <li>Click "Generate"</li>
                  <li>Copy the token immediately - it will only be shown once!</li>
                  <li>Store the token securely</li>
                </ol>
              </SubSection>

              <SubSection title="Security Warning">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-yellow-400 font-semibold mb-2">⚠️ Important Security Notice</p>
                  <p className="text-slate-300 text-sm">
                    PAT tokens are shown only once during creation. Make sure to copy and store them securely. 
                    Treat them like passwords - never commit them to repositories or share them publicly.
                  </p>
                </div>
              </SubSection>

              <SubSection title="Viewing Active Tokens">
                <p className="text-slate-300 mb-4">
                  You can view all your active tokens on the "Manage Tokens" page. The tokens are masked for security, 
                  showing only a portion of the token string. Each token displays:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Label/name</li>
                  <li>Creation date</li>
                  <li>Expiry status</li>
                  <li>Masked token string</li>
                </ul>
              </SubSection>

              <SubSection title="Deleting Tokens">
                <p className="text-slate-300 mb-4">
                  To revoke a token:
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-2">
                  <li>Go to "Manage Tokens" page</li>
                  <li>Find the token you want to delete</li>
                  <li>Click the delete button</li>
                  <li>Confirm deletion</li>
                </ol>
              </SubSection>
            </Section>

            {/* Repository Management */}
            <Section id="repository-management" title="Repository Management">
              <SubSection title="Creating a Repository">
                <ol className="list-decimal list-inside text-slate-300 space-y-2 mb-4">
                  <li>Click "Repositories" in the sidebar</li>
                  <li>Click "Create Repository" button</li>
                  <li>Enter repository name (alphanumeric, hyphens, underscores)</li>
                  <li>Add an optional description</li>
                  <li>Choose visibility: Public or Private</li>
                  <li>Click "Create"</li>
                </ol>
              </SubSection>

              <SubSection title="Repository Visibility">
                <div className="space-y-4 mb-4">
                  <div className="bg-[#11141d] border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-400 font-semibold mb-2">🌍 Public Repositories</p>
                    <p className="text-slate-300 text-sm">
                      Visible to everyone. Anyone can search and view public repositories, but only collaborators 
                      can make changes.
                    </p>
                  </div>
                  <div className="bg-[#11141d] border border-slate-500/30 rounded-lg p-4">
                    <p className="text-slate-400 font-semibold mb-2">🔒 Private Repositories</p>
                    <p className="text-slate-300 text-sm">
                      Only visible to you and your collaborators. Not searchable by other users.
                    </p>
                  </div>
                </div>
              </SubSection>

              <SubSection title="Viewing Repository Details">
                <p className="text-slate-300 mb-4">
                  Click on any repository to view its details page, which includes:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Repository name and description</li>
                  <li>Owner and visibility status</li>
                  <li>Clone URL for Git operations</li>
                  <li>File tree browser</li>
                  <li>Collaborators list</li>
                  <li>Repository settings (for owners/admins)</li>
                </ul>
              </SubSection>

              <SubSection title="Updating Repository Settings">
                <p className="text-slate-300 mb-4">
                  Owners and admins can update repository settings:
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-2">
                  <li>Open the repository details page</li>
                  <li>Click "Settings" tab</li>
                  <li>Update description or visibility</li>
                  <li>Click "Save Changes"</li>
                </ol>
              </SubSection>

              <SubSection title="Deleting a Repository">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <p className="text-red-400 font-semibold mb-2">⚠️ Warning: Permanent Action</p>
                  <p className="text-slate-300 text-sm">
                    Deleting a repository is permanent and cannot be undone. All files and history will be lost.
                  </p>
                </div>
                <p className="text-slate-300 mb-4">Only repository owners can delete repositories:</p>
                <ol className="list-decimal list-inside text-slate-300 space-y-2">
                  <li>Go to repository settings</li>
                  <li>Scroll to "Danger Zone"</li>
                  <li>Click "Delete Repository"</li>
                  <li>Confirm by typing the repository name</li>
                </ol>
              </SubSection>

              <SubSection title="Clone URL">
                <p className="text-slate-300 mb-4">
                  Each repository has a clone URL that you can use with Git CLI. Click the copy button next to the 
                  URL to copy it to your clipboard, then use it with git clone.
                </p>
                <CodeBlock
                  language="bash"
                  code={`# Clone using HTTPS with PAT token
git clone https://<USERNAME>:<PAT_TOKEN>@your-gitvault-domain.com/<USERNAME>/<REPO>.git`}
                  id="clone-url"
                  copyToClipboard={copyToClipboard}
                  copiedCode={copiedCode}
                />
              </SubSection>
            </Section>

            {/* File Browsing */}
            <Section id="file-browsing" title="File Browsing">
              <SubSection title="Navigating the File Tree">
                <p className="text-slate-300 mb-4">
                  GitVault provides a visual file tree for browsing repository contents:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Click on folders to expand and navigate deeper</li>
                  <li>Click on files to view their contents</li>
                  <li>Use the breadcrumb navigation to go back to parent directories</li>
                  <li>File and folder icons help identify item types</li>
                </ul>
              </SubSection>

              <SubSection title="Viewing File Contents">
                <p className="text-slate-300 mb-4">
                  Files are displayed using the Monaco code editor (same as VS Code) with:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Syntax highlighting for 30+ programming languages</li>
                  <li>Line numbers</li>
                  <li>Auto-detection of file type based on extension</li>
                  <li>Read-only viewing (no editing via web interface)</li>
                </ul>
              </SubSection>

              <SubSection title="Supported Languages">
                <p className="text-slate-300 mb-4">
                  GitVault supports syntax highlighting for: JavaScript, TypeScript, Python, Java, C, C++, C#, Go, 
                  Rust, Ruby, PHP, HTML, CSS, JSON, XML, YAML, Markdown, SQL, Shell scripts, and many more.
                </p>
              </SubSection>

              <SubSection title="Read-Only Access">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <p className="text-blue-400 font-semibold mb-2">ℹ️ Note</p>
                  <p className="text-slate-300 text-sm">
                    The web interface provides read-only file viewing. To edit files, commit changes, or push updates, 
                    use the Git CLI with your Personal Access Token.
                  </p>
                </div>
              </SubSection>
            </Section>

            {/* Collaboration */}
            <Section id="collaboration" title="Collaboration">
              <SubSection title="Adding Collaborators">
                <p className="text-slate-300 mb-4">
                  Repository owners and admins can invite team members:
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-2">
                  <li>Open the repository details page</li>
                  <li>Click "Collaborators" tab</li>
                  <li>Click "Add Collaborator"</li>
                  <li>Enter the user's email address</li>
                  <li>Select a role (Read, Write, or Admin)</li>
                  <li>Click "Add"</li>
                </ol>
              </SubSection>

              <SubSection title="Role Types & Permissions">
                <div className="overflow-x-auto mb-4">
                  <table className="w-full border border-white/10 rounded-lg overflow-hidden">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">View Files</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Clone/Pull</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Push Changes</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Manage Collaborators</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Delete Repo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="bg-indigo-500/5">
                        <td className="px-4 py-3 text-sm text-indigo-400 font-semibold">Owner</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-300 font-semibold">Admin</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-red-400">✗</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-300 font-semibold">Write</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-red-400">✗</td>
                        <td className="px-4 py-3 text-sm text-red-400">✗</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-300 font-semibold">Read</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-green-400">✓</td>
                        <td className="px-4 py-3 text-sm text-red-400">✗</td>
                        <td className="px-4 py-3 text-sm text-red-400">✗</td>
                        <td className="px-4 py-3 text-sm text-red-400">✗</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </SubSection>

              <SubSection title="Updating Collaborator Roles">
                <p className="text-slate-300 mb-4">
                  Owners and admins can change collaborator permissions:
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-2">
                  <li>Go to the Collaborators tab</li>
                  <li>Find the collaborator</li>
                  <li>Click on their current role</li>
                  <li>Select a new role from the dropdown</li>
                  <li>Changes are saved automatically</li>
                </ol>
              </SubSection>

              <SubSection title="Removing Collaborators">
                <p className="text-slate-300 mb-4">
                  To remove a team member:
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-2">
                  <li>Navigate to the Collaborators tab</li>
                  <li>Find the collaborator to remove</li>
                  <li>Click the "Remove" button</li>
                  <li>Confirm the action</li>
                </ol>
              </SubSection>
            </Section>

            {/* Search & Discovery */}
            <Section id="search-discovery" title="Search & Discovery">
              <SubSection title="Global Repository Search">
                <p className="text-slate-300 mb-4">
                  Use the search bar on the dashboard to find repositories:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Search across all repositories you have access to</li>
                  <li>Discover public repositories from other users</li>
                  <li>Results show repository name, owner, visibility, and your role</li>
                  <li>Live search - results update as you type</li>
                </ul>
              </SubSection>

              <SubSection title="Finding Your Repositories">
                <p className="text-slate-300 mb-4">
                  On the Repositories page, you can:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>View all your owned repositories</li>
                  <li>See repositories where you're a collaborator</li>
                  <li>Filter using the local search box</li>
                  <li>Sort by update date</li>
                </ul>
              </SubSection>

              <SubSection title="Public Repository Discovery">
                <p className="text-slate-300 mb-4">
                  Browse public repositories to discover projects:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>All public repositories are visible in global search</li>
                  <li>You can view files and contents of any public repository</li>
                  <li>Clone public repositories using the clone URL</li>
                </ul>
              </SubSection>
            </Section>

            {/* Dashboard */}
            <Section id="dashboard" title="Dashboard">
              <SubSection title="Account Overview">
                <p className="text-slate-300 mb-4">
                  The dashboard provides at-a-glance statistics:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Total repositories (owned + collaborator)</li>
                  <li>Public vs Private repository count</li>
                  <li>Active Personal Access Tokens</li>
                  <li>Total collaborators across all repositories</li>
                </ul>
              </SubSection>

              <SubSection title="Recent Repositories">
                <p className="text-slate-300 mb-4">
                  View your 5 most recently updated repositories with:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Repository name and description</li>
                  <li>Your role (Owner, Admin, Write, Read)</li>
                  <li>Visibility status (Public/Private)</li>
                  <li>Last update timestamp</li>
                </ul>
              </SubSection>

              <SubSection title="Security Health Score">
                <p className="text-slate-300 mb-4">
                  GitVault calculates a security score (0-100) based on:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li><strong>Token Security (25 pts):</strong> Fewer active tokens = better security</li>
                  <li><strong>Repository Visibility (30 pts):</strong> More private repos = higher score</li>
                  <li><strong>Repository Management (20 pts):</strong> Well-managed count of repos</li>
                  <li><strong>Collaboration Security (15 pts):</strong> Limited collaborators per repo</li>
                  <li><strong>Account Activity (10 pts):</strong> Active usage with private repos</li>
                </ul>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-semibold">80-100:</span>
                    <span className="text-slate-300">Excellent security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-semibold">60-79:</span>
                    <span className="text-slate-300">Good security, room for improvement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-semibold">0-59:</span>
                    <span className="text-slate-300">Security needs attention</span>
                  </div>
                </div>
              </SubSection>

              <SubSection title="Quick Actions">
                <p className="text-slate-300 mb-4">
                  Dashboard quick actions provide shortcuts to:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Create a new repository</li>
                  <li>Generate a new PAT token</li>
                  <li>Access documentation</li>
                </ul>
              </SubSection>
            </Section>

            {/* AI Assistant */}
            <Section id="ai-assistant" title="AI Assistant">
              <SubSection title="About the AI Helper">
                <p className="text-slate-300 mb-4">
                  GitVault includes an AI-powered chatbot assistant (powered by Google Gemini) to help you navigate 
                  the platform and answer questions about GitVault features.
                </p>
              </SubSection>

              <SubSection title="Accessing the Chatbot">
                <p className="text-slate-300 mb-4">
                  The AI assistant is available as a floating widget on every page:
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-2">
                  <li>Look for the chat icon in the bottom-right corner</li>
                  <li>Click to open the chat window</li>
                  <li>Type your question and press Enter</li>
                  <li>The AI will respond with helpful information</li>
                </ol>
              </SubSection>

              <SubSection title="What the AI Can Help With">
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>How to use GitVault features</li>
                  <li>Generating and using Personal Access Tokens</li>
                  <li>Managing repositories and collaborators</li>
                  <li>Understanding Git CLI commands with GitVault</li>
                  <li>Troubleshooting common issues</li>
                  <li>Security best practices</li>
                </ul>
              </SubSection>

              <SubSection title="Limitations">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <p className="text-blue-400 font-semibold mb-2">ℹ️ Important Notes</p>
                  <ul className="text-slate-300 text-sm space-y-2">
                    <li>• The AI is trained on GitVault documentation, not your specific repositories</li>
                    <li>• Never share your actual PAT tokens or passwords with the AI</li>
                    <li>• The AI can't perform actions - it only provides guidance</li>
                    <li>• For specific technical Git questions, consult official Git documentation</li>
                  </ul>
                </div>
              </SubSection>
            </Section>

            {/* CLI Usage */}
            <Section id="cli-usage" title="CLI Usage">
              <SubSection title="Prerequisites">
                <p className="text-slate-300 mb-4">
                  Before using Git with GitVault, ensure you have:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Git installed on your system</li>
                  <li>A Personal Access Token (PAT) generated from GitVault</li>
                  <li>Repository clone URL from GitVault</li>
                </ul>
              </SubSection>

              <SubSection title="Authentication with PAT">
                <p className="text-slate-300 mb-4">
                  GitVault uses Personal Access Tokens for CLI authentication. When cloning or pushing to repositories, 
                  include your username and PAT token in the URL:
                </p>
                <CodeBlock
                  language="bash"
                  code={`# URL format
https://<YOUR_USERNAME>:<YOUR_PAT_TOKEN>@your-gitvault-domain.com/<OWNER>/<REPO>.git

# Example clone command
git clone https://john:<PAT_TOKEN>@gitvault.example.com/john/my-project.git`}
                  id="cli-auth"
                  copyToClipboard={copyToClipboard}
                  copiedCode={copiedCode}
                />
              </SubSection>

              <SubSection title="Cloning a Repository">
                <CodeBlock
                  language="bash"
                  code={`# Clone a repository
git clone https://<USERNAME>:<PAT>@your-gitvault-domain.com/<OWNER>/<REPO>.git

# Navigate into the cloned repository
cd <REPO>

# Verify remote URL
git remote -v`}
                  id="cli-clone"
                  copyToClipboard={copyToClipboard}
                  copiedCode={copiedCode}
                />
              </SubSection>

              <SubSection title="Basic Git Operations">
                <CodeBlock
                  language="bash"
                  code={`# Check repository status
git status

# Create and switch to a new branch
git checkout -b feature/my-feature

# Stage changes
git add .

# Commit changes
git commit -m "Add new feature"

# Push changes to GitVault
git push origin feature/my-feature

# Pull latest changes
git pull origin main

# Fetch updates without merging
git fetch origin`}
                  id="cli-operations"
                  copyToClipboard={copyToClipboard}
                  copiedCode={copiedCode}
                />
              </SubSection>

              <SubSection title="Setting Up Remote URL">
                <p className="text-slate-300 mb-4">
                  If you already have a local repository, you can add GitVault as a remote:
                </p>
                <CodeBlock
                  language="bash"
                  code={`# Add GitVault as remote
git remote add origin https://<USERNAME>:<PAT>@your-gitvault-domain.com/<OWNER>/<REPO>.git

# Verify remote
git remote -v

# Push to GitVault
git push -u origin main`}
                  id="cli-remote"
                  copyToClipboard={copyToClipboard}
                  copiedCode={copiedCode}
                />
              </SubSection>

              <SubSection title="Security Best Practices">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-yellow-400 font-semibold mb-2">⚠️ Security Tips</p>
                  <ul className="text-slate-300 text-sm space-y-2">
                    <li>• Never commit PAT tokens to your repository</li>
                    <li>• Use Git credential helpers to store credentials securely</li>
                    <li>• Rotate tokens regularly</li>
                    <li>• Delete tokens you're no longer using</li>
                    <li>• Use different tokens for different machines</li>
                  </ul>
                </div>
              </SubSection>

              <SubSection title="Git Credential Helper">
                <p className="text-slate-300 mb-4">
                  To avoid entering your PAT token every time, use Git's credential helper:
                </p>
                <CodeBlock
                  language="bash"
                  code={`# Store credentials in memory for 15 minutes
git config --global credential.helper cache

# Store credentials permanently (encrypted on macOS/Windows)
git config --global credential.helper store

# On Windows, use the Windows Credential Manager
git config --global credential.helper wincred`}
                  id="cli-cred"
                  copyToClipboard={copyToClipboard}
                  copiedCode={copiedCode}
                />
              </SubSection>
            </Section>

            {/* Settings */}
            <Section id="settings" title="Settings">
              <SubSection title="Account Information">
                <p className="text-slate-300 mb-4">
                  View your account details in the Settings page:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Username (read-only)</li>
                  <li>Email address (read-only)</li>
                </ul>
              </SubSection>

              <SubSection title="Changing Password">
                <p className="text-slate-300 mb-4">
                  Update your account password:
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-2">
                  <li>Go to Settings page</li>
                  <li>Scroll to "Change Password" section</li>
                  <li>Enter your current password</li>
                  <li>Enter new password (minimum 6 characters)</li>
                  <li>Confirm new password</li>
                  <li>Click "Change Password"</li>
                </ol>
              </SubSection>

              <SubSection title="Logout">
                <p className="text-slate-300 mb-4">
                  To log out of your account:
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-2">
                  <li>Click on your profile in the top-right</li>
                  <li>Select "Logout"</li>
                  <li>You'll be redirected to the home page</li>
                </ol>
              </SubSection>
            </Section>

            {/* Security */}
            <Section id="security" title="Security Best Practices">
              <SubSection title="Token Security">
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Generate unique tokens for each device/application</li>
                  <li>Use descriptive labels to identify token usage</li>
                  <li>Never commit tokens to version control</li>
                  <li>Rotate tokens regularly (every 3-6 months)</li>
                  <li>Delete unused or compromised tokens immediately</li>
                  <li>Store tokens in secure password managers</li>
                </ul>
              </SubSection>

              <SubSection title="Repository Visibility">
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Use private repositories for sensitive code</li>
                  <li>Review repository visibility before sharing links</li>
                  <li>Public repos are visible to everyone - never commit secrets</li>
                  <li>Consider who needs access before making repositories public</li>
                </ul>
              </SubSection>

              <SubSection title="Collaboration Security">
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Grant minimum necessary permissions (use Read when possible)</li>
                  <li>Regularly audit collaborator list</li>
                  <li>Remove collaborators who no longer need access</li>
                  <li>Use Admin role sparingly</li>
                  <li>Verify email addresses before adding collaborators</li>
                </ul>
              </SubSection>

              <SubSection title="Account Security">
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Use a strong, unique password</li>
                  <li>Change password regularly</li>
                  <li>Don't share your account credentials</li>
                  <li>Log out from shared computers</li>
                  <li>Monitor your active tokens regularly</li>
                </ul>
              </SubSection>
            </Section>

            {/* Troubleshooting */}
            <Section id="troubleshooting" title="Troubleshooting">
              <SubSection title="Authentication Errors">
                <div className="space-y-4">
                  <div className="bg-[#11141d] border border-white/10 rounded-lg p-4">
                    <p className="text-red-400 font-semibold mb-2">Error: Invalid credentials</p>
                    <p className="text-slate-300 text-sm mb-2">Solutions:</p>
                    <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                      <li>Verify your email and password are correct</li>
                      <li>Check for extra spaces in email/password</li>
                      <li>Try resetting your password if forgotten</li>
                    </ul>
                  </div>
                  <div className="bg-[#11141d] border border-white/10 rounded-lg p-4">
                    <p className="text-red-400 font-semibold mb-2">Error: Token authentication failed (CLI)</p>
                    <p className="text-slate-300 text-sm mb-2">Solutions:</p>
                    <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                      <li>Ensure you copied the complete PAT token</li>
                      <li>Check if the token has expired</li>
                      <li>Verify the URL format includes username and token</li>
                      <li>Generate a new token if the old one is lost</li>
                    </ul>
                  </div>
                </div>
              </SubSection>

              <SubSection title="Repository Access Issues">
                <div className="space-y-4">
                  <div className="bg-[#11141d] border border-white/10 rounded-lg p-4">
                    <p className="text-red-400 font-semibold mb-2">Error: Permission denied</p>
                    <p className="text-slate-300 text-sm mb-2">Solutions:</p>
                    <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                      <li>Check if you're a collaborator on the repository</li>
                      <li>Verify your role has sufficient permissions</li>
                      <li>Contact the repository owner for access</li>
                      <li>Ensure the repository exists and isn't deleted</li>
                    </ul>
                  </div>
                  <div className="bg-[#11141d] border border-white/10 rounded-lg p-4">
                    <p className="text-red-400 font-semibold mb-2">Error: Repository not found</p>
                    <p className="text-slate-300 text-sm mb-2">Solutions:</p>
                    <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                      <li>Check the repository name spelling</li>
                      <li>Verify the owner username is correct</li>
                      <li>Ensure the repository is not private (if you're not a collaborator)</li>
                    </ul>
                  </div>
                </div>
              </SubSection>

              <SubSection title="File Browsing Issues">
                <div className="bg-[#11141d] border border-white/10 rounded-lg p-4">
                  <p className="text-red-400 font-semibold mb-2">Error: Cannot load file tree</p>
                  <p className="text-slate-300 text-sm mb-2">Solutions:</p>
                  <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                    <li>Refresh the page</li>
                    <li>Check your internet connection</li>
                    <li>Verify the repository has content</li>
                    <li>Try logging out and back in</li>
                  </ul>
                </div>
              </SubSection>

              <SubSection title="Search Not Working">
                <div className="bg-[#11141d] border border-white/10 rounded-lg p-4">
                  <p className="text-red-400 font-semibold mb-2">Search returns no results</p>
                  <p className="text-slate-300 text-sm mb-2">Solutions:</p>
                  <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                    <li>Try different search terms</li>
                    <li>Check spelling</li>
                    <li>Remember: search is case-insensitive</li>
                    <li>Private repos only show if you have access</li>
                  </ul>
                </div>
              </SubSection>

              <SubSection title="Git CLI Issues">
                <div className="space-y-4">
                  <div className="bg-[#11141d] border border-white/10 rounded-lg p-4">
                    <p className="text-red-400 font-semibold mb-2">Error: Authentication required</p>
                    <p className="text-slate-300 text-sm mb-2">Solutions:</p>
                    <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                      <li>Include PAT token in the clone/push URL</li>
                      <li>Use Git credential helper to store credentials</li>
                      <li>Format: https://username:token@domain/repo.git</li>
                    </ul>
                  </div>
                  <div className="bg-[#11141d] border border-white/10 rounded-lg p-4">
                    <p className="text-red-400 font-semibold mb-2">Error: Push rejected</p>
                    <p className="text-slate-300 text-sm mb-2">Solutions:</p>
                    <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                      <li>Ensure you have Write or Admin permissions</li>
                      <li>Pull latest changes first: git pull origin main</li>
                      <li>Resolve any merge conflicts</li>
                      <li>Verify PAT token has necessary permissions</li>
                    </ul>
                  </div>
                </div>
              </SubSection>
            </Section>

            {/* FAQ */}
            <Section id="faq" title="Frequently Asked Questions">
              <SubSection title="General Questions">
                <FAQItem
                  question="Can I edit files directly in the browser?"
                  answer="No, GitVault's web interface provides read-only file viewing. To edit files, commit changes, or push updates, use the Git CLI with your Personal Access Token."
                />
                <FAQItem
                  question="How do I commit and push changes?"
                  answer="Use Git from the command line. Clone your repository using your PAT token, make changes locally, commit them, and push back to GitVault using standard Git commands."
                />
                <FAQItem
                  question="Is GitVault free to use?"
                  answer="Check with your GitVault administrator for pricing and plan details. The platform supports both personal and team usage."
                />
                <FAQItem
                  question="Can I import existing Git repositories?"
                  answer="Yes, create a new repository on GitVault, then push your existing local repository using the provided clone URL with your PAT token."
                />
              </SubSection>

              <SubSection title="Repository Questions">
                <FAQItem
                  question="What's the difference between public and private repositories?"
                  answer="Public repositories are visible to everyone and appear in search results. Private repositories are only visible to you and your collaborators."
                />
                <FAQItem
                  question="Can I change repository visibility later?"
                  answer="Yes, repository owners can change visibility between public and private at any time in the repository settings."
                />
                <FAQItem
                  question="How many repositories can I create?"
                  answer="There's no hard limit, but managing many repositories may affect your security score. Keep your repository count organized and manageable."
                />
              </SubSection>

              <SubSection title="Collaboration Questions">
                <FAQItem
                  question="What's the difference between Admin and Write roles?"
                  answer="Write role can view files and push changes. Admin role can also manage collaborators (add/remove users, change roles), but only the Owner can delete the repository."
                />
                <FAQItem
                  question="Can collaborators see private repositories?"
                  answer="Yes, collaborators can access private repositories they're added to, regardless of the repository's visibility setting."
                />
                <FAQItem
                  question="How do I remove myself from a repository?"
                  answer="Contact the repository owner or an admin to remove you. Collaborators cannot remove themselves."
                />
              </SubSection>

              <SubSection title="Security Questions">
                <FAQItem
                  question="Are PAT tokens secure?"
                  answer="Yes, PAT tokens are secure when handled properly. Store them like passwords, never commit them to repositories, and rotate them regularly."
                />
                <FAQItem
                  question="What should I do if my PAT token is compromised?"
                  answer="Immediately delete the compromised token in the 'Manage Tokens' page and generate a new one. Update any services using the old token."
                />
                <FAQItem
                  question="How can I improve my security score?"
                  answer="Use more private repositories, reduce the number of active PAT tokens, limit collaborators per repository, and maintain a manageable number of repositories."
                />
              </SubSection>

              <SubSection title="Technical Questions">
                <FAQItem
                  question="What file types are supported for syntax highlighting?"
                  answer="GitVault supports 30+ languages including JavaScript, Python, Java, C/C++, Go, Rust, Ruby, PHP, HTML, CSS, JSON, YAML, Markdown, SQL, and more."
                />
                <FAQItem
                  question="Can I use GitVault with Git GUI clients?"
                  answer="Yes, any Git client that supports HTTPS authentication can work with GitVault using your PAT token in the repository URL."
                />
                <FAQItem
                  question="Does GitVault support Git LFS?"
                  answer="Check with your GitVault administrator for Git LFS support and configuration details."
                />
              </SubSection>
            </Section>
          </div>

          {/* Back to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-full shadow-lg transition-all duration-200 opacity-90 hover:opacity-100"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </main>
      </div>
    </div>
  );
}

// Section Component
function Section({ id, title, children }) {
  return (
    <section id={id} className="mb-16 scroll-mt-8">
      <h2 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}

// SubSection Component
function SubSection({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-indigo-400 mb-3">{title}</h3>
      {children}
    </div>
  );
}

// Code Block Component
function CodeBlock({ language, code, id, copyToClipboard, copiedCode }) {
  return (
    <div className="relative group mb-4">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => copyToClipboard(code, id)}
          className="bg-white/10 hover:bg-white/20 text-slate-300 px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors"
        >
          {copiedCode === id ? (
            <>
              <Check className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-[#0b0d14] border border-white/10 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-slate-300 font-mono">{code}</code>
      </pre>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-[#11141d] border border-white/10 rounded-lg p-4 hover:border-indigo-400/30 transition-colors"
      >
        <div className="flex justify-between items-start gap-2">
          <span className="font-semibold text-white">{question}</span>
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="mt-2 ml-4 pl-4 border-l-2 border-indigo-400/30">
          <p className="text-slate-300 text-sm">{answer}</p>
        </div>
      )}
    </div>
  );
}
