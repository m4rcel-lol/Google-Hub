import {
  Activity,
  Bell,
  Book,
  BookOpen,
  Check,
  ChevronDown,
  CircleDot,
  Code2,
  FileText,
  Folder,
  GitBranch,
  GitFork,
  GitPullRequest,
  Grid,
  Heart,
  HelpCircle,
  History,
  LayoutGrid,
  LineChart,
  Link2,
  MessageSquare,
  MoreVertical,
  PlayCircle,
  Plus,
  Scale,
  Search,
  Settings,
  Shield,
  Star,
  Tag,
  Globe,
  Info,
  ArrowLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('Invalid JSON response');
  }
};

const GoogleLogo = () => (
  <div className="flex items-center text-[22px] font-medium tracking-tight select-none cursor-pointer">
    <span className="text-[#4285F4]">G</span>
    <span className="text-[#EA4335]">o</span>
    <span className="text-[#FBBC05]">o</span>
    <span className="text-[#4285F4]">g</span>
    <span className="text-[#34A853]">l</span>
    <span className="text-[#EA4335]">e</span>
  </div>
);

const LandingPage = ({ onSearch }: { onSearch: (val: string) => void }) => {
  const [val, setVal] = useState('');
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center p-8 min-h-full"
    >
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="flex justify-center mb-8">
           <div className="text-[48px] font-medium tracking-tight select-none flex items-center">
            <span className="text-[#2f81f7]">G</span>
            <span className="text-[#f85149]">o</span>
            <span className="text-[#e3b341]">o</span>
            <span className="text-[#2f81f7]">g</span>
            <span className="text-[#3fb950]">l</span>
            <span className="text-[#f85149]">e</span>
            <span className="ml-3 text-google-gray-800">Hub</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-google-gray-800">
          A dark-themed perspective on Git instances
        </h1>
        <p className="text-google-gray-500 text-lg">
          Search for any public repository, user, or organization on GitHub, Gitea, Forgejo, or Codeberg to view its source code and activity through a clean interface with Google aesthetics.
        </p>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          if (val.trim()) onSearch(val.trim());
        }} className="mt-8 relative max-w-xl mx-auto">
          <div className="flex items-center w-full h-14 bg-google-gray-50/50 rounded-full px-6 border border-google-gray-200 hover:border-google-gray-400 focus-within:border-google-blue-600 transition-all shadow-sm">
            <Search className="w-5 h-5 text-google-gray-500 shrink-0" />
            <input 
              type="text" 
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Search e.g., facebook/react or gitea: https://code.lgbt/user/repo" 
              className="flex-1 bg-transparent border-none outline-none px-4 text-[16px] text-google-gray-800 placeholder-google-gray-500 w-full min-w-0"
            />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => onSearch('facebook/react')} className="px-4 py-2 bg-google-gray-100/5 hover:bg-google-gray-200/10 border border-google-gray-200 rounded-md text-sm text-google-gray-400 font-medium transition-colors">
              Try React (GitHub)
            </button>
            <button type="button" onClick={() => onSearch('codeberg: https://codeberg.org/forgejo/forgejo')} className="px-4 py-2 bg-google-gray-100/5 hover:bg-google-gray-200/10 border border-google-gray-200 rounded-md text-sm text-google-gray-400 font-medium transition-colors">
              Try Forgejo (Codeberg)
            </button>
            <button type="button" onClick={() => onSearch('gitea: https://gitea.com/gitea/go-sdk')} className="px-4 py-2 bg-google-gray-100/5 hover:bg-google-gray-200/10 border border-google-gray-200 rounded-md text-sm text-google-gray-400 font-medium transition-colors">
              Try go-sdk (Gitea)
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

const TopNav = ({ onSearch, onLogoClick, repoOwner, onAvatarClick }: { onSearch: (val: string) => void, onLogoClick: () => void, repoOwner: string, onAvatarClick?: () => void }) => {
  const [val, setVal] = useState('');
  return (
    <header className="flex h-16 items-center justify-between border-b border-google-gray-200 px-4 md:px-6 shrink-0 bg-white z-10 sticky top-0">
      <div 
        className="flex items-center w-auto md:w-64 shrink-0 mr-4 cursor-pointer"
        onClick={onLogoClick}
      >
        <GoogleLogo />
      </div>
      
      <div className="flex-1 max-w-2xl px-2 md:px-4 hidden sm:block">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (val.trim()) onSearch(val.trim());
        }} className="flex items-center w-full h-10 md:h-12 bg-google-gray-100 rounded-full px-4 border border-transparent hover:border-google-gray-200 focus-within:bg-white focus-within:border-google-gray-200 focus-within:shadow-sm transition-colors">
          <Search className="w-5 h-5 text-google-gray-500 shrink-0" />
          <input 
            type="text" 
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Search repo, user, or gitea: url..." 
            className="flex-1 bg-transparent border-none outline-none px-3 text-sm md:text-[15px] text-google-gray-800 placeholder-google-gray-500 w-full min-w-0"
          />
          <button type="submit" className="hidden md:flex items-center justify-center w-6 h-6 rounded bg-white text-google-gray-500 text-xs border border-google-gray-200 shadow-sm shrink-0 font-medium hover:bg-google-gray-50 cursor-pointer">
            /
          </button>
        </form>
      </div>
    </header>
  );
};

const SideNavItem = ({ icon: Icon, label, count, active, onClick }: { icon: any, label: string, count?: number, active?: boolean, onClick?: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
      active 
        ? 'bg-google-blue-50 text-google-blue-700' 
        : 'text-google-gray-700 hover:bg-google-gray-50'
    }`}>
      <div className="flex items-center space-x-3">
        <Icon className={`w-5 h-5 ${active ? 'text-google-blue-600' : 'text-google-gray-500'}`} />
        <span>{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-xs bg-google-gray-100 text-google-gray-700 font-semibold px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
};

const SideNav = ({ repoData, activeTab, onTabChange }: { repoData: any, activeTab: string, onTabChange: (tab: string) => void }) => (
  <aside className="w-[280px] shrink-0 border-r border-google-gray-200 h-full hidden md:flex flex-col pt-4 pb-6 px-3 bg-white overflow-y-auto">
    <nav className="flex-1 space-y-1">
      <SideNavItem icon={Code2} label="Code" active={activeTab === 'code'} onClick={() => onTabChange('code')} />
      <SideNavItem icon={CircleDot} label="Issues" count={repoData?.open_issues_count || 0} active={activeTab === 'issues'} onClick={() => onTabChange('issues')} />
      <SideNavItem icon={GitPullRequest} label="Pull requests" active={activeTab === 'pulls'} onClick={() => onTabChange('pulls')} />
      <SideNavItem icon={MessageSquare} label="Discussions" active={activeTab === 'discussions'} onClick={() => onTabChange('discussions')} />
      <SideNavItem icon={PlayCircle} label="Actions" active={activeTab === 'actions'} onClick={() => onTabChange('actions')} />
      <SideNavItem icon={LayoutGrid} label="Projects" active={activeTab === 'projects'} onClick={() => onTabChange('projects')} />
      <SideNavItem icon={Book} label="Wiki" active={activeTab === 'wiki'} onClick={() => onTabChange('wiki')} />
      <SideNavItem icon={Shield} label="Security" active={activeTab === 'security'} onClick={() => onTabChange('security')} />
      <SideNavItem icon={LineChart} label="Insights" active={activeTab === 'insights'} onClick={() => onTabChange('insights')} />
    </nav>
  </aside>
);

const GenericListTab = ({ repoOwner, repoName, apiUrl, endpoint, title, icon: Icon, emptyText }: { repoOwner: string, repoName: string, apiUrl: string, endpoint: string, title: string, icon: any, emptyText: string }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}/${endpoint}`)
      .then(data => {
        setItems(Array.isArray(data) ? data : (data.workflow_runs || data.projects || []));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [repoOwner, repoName, apiUrl, endpoint]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex-1 py-6 px-4 md:px-8 max-w-7xl mx-auto w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-google-gray-800">{title}</h2>
      </div>

      <div className="border border-google-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="bg-google-gray-50 px-4 py-3 border-b border-google-gray-200 flex items-center font-medium text-sm text-google-gray-700">
          <Icon className="w-5 h-5 mr-2 text-google-blue-600" />
          {loading ? 'Loading...' : error ? 'Error or Unsupported' : `${items.length} ${title}`}
        </div>
        
        <div className="divide-y divide-google-gray-200">
          {loading ? (
            <div className="p-8 text-center text-google-gray-500">Loading {title.toLowerCase()}...</div>
          ) : error ? (
            <div className="p-12 text-center text-google-gray-500">
              <Icon className="w-8 h-8 mx-auto mb-3 opacity-50" />
              Not available for this provider or repository.
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center">
              <Icon className="w-8 h-8 text-google-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-google-gray-800">{emptyText}</h3>
            </div>
          ) : (
            items.map((item, i) => (
              <div key={item.id || i} className="p-4 hover:bg-google-gray-50 transition-colors flex items-start gap-3">
                <Icon className="w-5 h-5 text-google-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <a href={item.html_url || '#'} target="_blank" rel="noreferrer" className="text-base font-semibold text-google-gray-800 hover:text-google-blue-600 break-words line-clamp-2 mb-1">
                    {item.title || item.name || item.display_title || `Item #${item.id}`}
                  </a>
                  <div className="text-xs text-google-gray-500">
                    {item.state || item.status ? `Status: ${item.state || item.status} • ` : ''}
                    {item.updated_at || item.created_at ? `Updated on ${new Date(item.updated_at || item.created_at).toLocaleDateString()}` : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const IssuesTab = ({ repoOwner, repoName, apiUrl }: { repoOwner: string, repoName: string, apiUrl: string }) => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}/issues?state=open&per_page=30`)
      .then(data => {
        setIssues(Array.isArray(data) ? data.filter((issue: any) => !issue.pull_request) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repoOwner, repoName]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex-1 py-6 px-4 md:px-8 max-w-7xl mx-auto w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-google-gray-800">Issues</h2>
      </div>

      <div className="border border-google-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="bg-google-gray-50 px-4 py-3 border-b border-google-gray-200 flex items-center font-medium text-sm text-google-gray-700">
          <CircleDot className="w-5 h-5 mr-2 text-google-green-600" />
          {loading ? 'Loading...' : `${issues.length} Open issues`}
        </div>
        
        <div className="divide-y divide-google-gray-200">
          {loading ? (
            <div className="p-8 text-center text-google-gray-500">Loading issues...</div>
          ) : issues.length === 0 ? (
            <div className="p-12 text-center">
              <CircleDot className="w-8 h-8 text-google-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-google-gray-800">No open issues</h3>
            </div>
          ) : (
            issues.map(issue => (
              <div key={issue.id} className="p-4 hover:bg-google-gray-50 transition-colors flex items-start gap-3">
                <CircleDot className="w-5 h-5 text-google-green-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <a href={issue.html_url} target="_blank" rel="noreferrer" className="text-base font-semibold text-google-gray-800 hover:text-google-blue-600 break-words line-clamp-2 mb-1">
                    {issue.title}
                  </a>
                  <div className="text-xs text-google-gray-500">
                    #{issue.number} opened on {new Date(issue.created_at).toLocaleDateString()} by {issue.user.login}
                  </div>
                </div>
                {issue.comments > 0 && (
                  <div className="flex items-center text-google-gray-500 text-xs shrink-0">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {issue.comments}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

const PullsTab = ({ repoOwner, repoName, apiUrl }: { repoOwner: string, repoName: string, apiUrl: string }) => {
  const [pulls, setPulls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}/pulls?state=open&per_page=30`)
      .then(data => {
        setPulls(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repoOwner, repoName]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex-1 py-6 px-4 md:px-8 max-w-7xl mx-auto w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-google-gray-800">Pull requests</h2>
      </div>

      <div className="border border-google-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="bg-google-gray-50 px-4 py-3 border-b border-google-gray-200 flex items-center font-medium text-sm text-google-gray-700">
          <GitPullRequest className="w-5 h-5 mr-2 text-google-green-600" />
          {loading ? 'Loading...' : `${pulls.length} Open pull requests`}
        </div>
        
        <div className="divide-y divide-google-gray-200">
          {loading ? (
            <div className="p-8 text-center text-google-gray-500">Loading pull requests...</div>
          ) : pulls.length === 0 ? (
            <div className="p-12 text-center">
              <GitPullRequest className="w-8 h-8 text-google-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-google-gray-800">No open pull requests</h3>
            </div>
          ) : (
            pulls.map(pr => (
              <div key={pr.id} className="p-4 hover:bg-google-gray-50 transition-colors flex items-start gap-3">
                <GitPullRequest className="w-5 h-5 text-google-green-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <a href={pr.html_url} target="_blank" rel="noreferrer" className="text-base font-semibold text-google-gray-800 hover:text-google-blue-600 break-words line-clamp-2 mb-1">
                    {pr.title}
                  </a>
                  <div className="text-xs text-google-gray-500">
                    #{pr.number} opened on {new Date(pr.created_at).toLocaleDateString()} by {pr.user.login}
                  </div>
                </div>
                {pr.comments > 0 && (
                  <div className="flex items-center text-google-gray-500 text-xs shrink-0">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {pr.comments}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};
const RightSidebar = ({ repoData, releases, repoOwner, repoName, apiUrl }: { repoData: any, releases: any[], repoOwner: string, repoName: string, apiUrl: string }) => {
  const topics = repoData?.topics || [];
  const homepage = repoData?.homepage;
  const [languages, setLanguages] = useState<Record<string, number>>({});

  useEffect(() => {
    if (repoOwner && repoName) {
      fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}/languages`)
        .then(data => {
          if (!data.message) setLanguages(data);
        })
        .catch(console.error);
    }
  }, [repoOwner, repoName]);

  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);

  return (
    <div className="w-[320px] shrink-0 pt-6 px-6 hidden xl:block">
      <div className="mb-6">
        <h3 className="font-semibold text-google-gray-800 mb-3 text-base">About</h3>
        <p className="text-sm text-google-gray-700 leading-relaxed mb-4">
          {repoData?.description || "No description provided."}
        </p>

        {homepage && (
          <a href={homepage.startsWith('http') ? homepage : `https://${homepage}`} target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-google-blue-600 hover:underline mb-4">
            <Link2 className="w-4 h-4 mr-1.5" />
            {homepage}
          </a>
        )}

        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {topics.map((tag: string) => (
              <span key={tag} className="text-xs font-medium text-google-blue-700 bg-google-blue-50 px-2.5 py-1 rounded-full hover:bg-google-blue-100 cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="space-y-3">
          <button className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors w-full text-left">
            <BookOpen className="w-4 h-4 mr-3 text-google-gray-500" />
            Readme
          </button>
          {repoData?.license && (
            <button className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors w-full text-left">
              <Scale className="w-4 h-4 mr-3 text-google-gray-500" />
              {repoData.license.name}
            </button>
          )}
          <button className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors w-full text-left">
            <Activity className="w-4 h-4 mr-3 text-google-gray-500" />
            Activity
          </button>
        </div>
        
        <div className="space-y-3 mt-6">
          <button className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors w-full text-left">
            <Star className="w-4 h-4 mr-3 text-google-gray-500" />
            <span className="font-semibold text-google-gray-800 mr-1">{repoData?.stargazers_count?.toLocaleString() || 0}</span> stars
          </button>
          <button className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors w-full text-left">
            <GitFork className="w-4 h-4 mr-3 text-google-gray-500" />
            <span className="font-semibold text-google-gray-800 mr-1">{repoData?.forks_count?.toLocaleString() || 0}</span> forks
          </button>
          <button className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors w-full text-left">
            <Bell className="w-4 h-4 mr-3 text-google-gray-500" />
            <span className="font-semibold text-google-gray-800 mr-1">{repoData?.watchers_count?.toLocaleString() || 0}</span> watching
          </button>
        </div>
      </div>
      
      <div className="pt-6 border-t border-google-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button className="font-semibold text-google-gray-800 text-base hover:text-google-blue-600">Releases</button>
          <span className="text-xs bg-google-gray-100 text-google-gray-700 font-semibold px-2 py-0.5 rounded-full">{releases.length}</span>
        </div>
        {releases.length > 0 ? (
          <div className="mb-4">
            <button className="flex items-center font-semibold text-google-gray-800 hover:text-google-blue-600 mb-1">
              <Tag className="w-4 h-4 mr-2 text-google-green-600" />
              {releases[0].tag_name}
              <span className="ml-2 text-xs text-google-green-600 border border-current bg-google-green-600/10 px-2 py-[1px] rounded-full">Latest</span>
            </button>
            <p className="text-xs text-google-gray-500 ml-6">{new Date(releases[0].published_at).toLocaleDateString()}</p>
          </div>
        ) : (
          <div className="text-sm text-google-gray-500 mb-4">No releases published</div>
        )}
        {releases.length > 1 && (
          <button className="text-sm text-google-blue-600 hover:underline font-medium">
            + {releases.length - 1} releases
          </button>
        )}
      </div>

      {Object.keys(languages).length > 0 && (
        <div className="pt-6 mt-6 border-t border-google-gray-200">
          <h3 className="font-semibold text-google-gray-800 mb-3 text-base">Languages</h3>
          <div className="flex w-full h-2 rounded-full overflow-hidden mb-3">
            {Object.entries(languages).map(([lang, bytes], i) => {
               const colors = ['bg-google-blue-600', 'bg-google-red', 'bg-google-yellow', 'bg-google-green-600', 'bg-google-gray-600'];
               return (
                 <div key={lang} style={{ width: `${(bytes / totalBytes) * 100}%` }} className={colors[i % colors.length]} title={lang} />
               );
            })}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {Object.entries(languages).map(([lang, bytes], i) => {
               const colors = ['text-google-blue-600', 'text-google-red', 'text-google-yellow', 'text-google-green-600', 'text-google-gray-600'];
               return (
                 <div key={lang} className="flex items-center text-sm text-google-gray-700">
                   <div className={`w-2 h-2 rounded-full mr-2 bg-current ${colors[i % colors.length]}`} />
                   <span className="font-medium mr-1">{lang}</span>
                   <span className="text-google-gray-500">{((bytes / totalBytes) * 100).toFixed(1)}%</span>
                 </div>
               );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const FileRow = ({ icon: Icon, name, isDir = false, onClick }: { key?: string, icon: any, name: string, isDir?: boolean, onClick: () => void }) => (
  <button onClick={onClick} className="w-full flex items-center py-2.5 px-4 border-t border-google-gray-200 hover:bg-google-gray-50 transition-colors group cursor-pointer text-left">
    <Icon className={`w-5 h-5 mr-3 shrink-0 ${isDir ? 'text-google-blue-600 fill-google-blue-600' : 'text-google-gray-500'}`} />
    <span className="text-sm font-medium text-google-gray-800 truncate group-hover:text-google-blue-600 transition-colors max-w-full">
      {name}
    </span>
  </button>
);

const MainContent = ({ 
  repoOwner, repoName, currentPath, repoData, contents, commit, releases, onNavigate, fileContent, readmeContent, isLoading, onProfileClick, apiUrl
}: { 
  repoOwner: string, repoName: string, currentPath: string, repoData: any, contents: any[], commit: any, releases: any[], onNavigate: (path: string) => void, fileContent: string | null, readmeContent: string | null, isLoading: boolean, onProfileClick: (username: string) => void, apiUrl: string
}) => {
  const commitMsg = commit?.commit?.message ? commit.commit.message.split('\n')[0] : 'Loading...';
  const commitOid = commit?.sha ? commit.sha.substring(0, 7) : '...';
  const commitDate = commit?.commit?.author?.date ? new Date(commit.commit.author.date).toLocaleDateString() : '';

  const renderMarkdown = (content: string) => (
    <div className="p-6 md:p-8 text-[15px] leading-relaxed w-full min-w-0 max-w-full break-words text-google-gray-800 space-y-4">
      <Markdown 
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold border-b border-google-gray-200 pb-2 mb-4 mt-6" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold border-b border-google-gray-200 pb-2 mb-4 mt-6" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-4 mt-6" {...props} />,
          p: ({node, ...props}) => <p className="mb-4 text-google-gray-800 leading-relaxed break-words" {...props} />,
          a: ({node, ...props}) => <a className="text-google-blue-600 hover:underline break-words" {...props} />,
          ul: ({node, className, ...props}) => <ul className={`list-disc pl-5 mb-4 space-y-1 ${className?.includes('contains-task-list') ? 'list-none pl-0' : ''}`} {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
          li: ({node, className, ...props}) => <li className={`break-words ${className?.includes('task-list-item') ? 'flex items-center gap-2' : ''}`} {...props} />,
          code: ({node, inline, className, children, ...props}: any) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="mb-4 rounded-md border border-google-gray-200 overflow-hidden text-[13px] bg-google-gray-50">
                <SyntaxHighlighter
                  style={atomOneDark as any}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, background: 'transparent' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={`${inline ? 'px-1.5 py-0.5 rounded-md bg-google-gray-100 text-[13px] font-mono break-words' : 'block bg-google-gray-50 p-4 rounded-md overflow-x-auto text-[13px] font-mono break-all mb-4'}`} {...props}>
                {children}
              </code>
            );
          },
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-google-gray-200 pl-4 text-google-gray-600 italic mb-4" {...props} />,
          img: ({node, ...props}) => <img className="max-w-full h-auto rounded-md border border-google-gray-200" {...props} />,
          table: ({node, ...props}) => <div className="overflow-x-auto mb-4"><table className="min-w-full divide-y divide-google-gray-200 border border-google-gray-200" {...props} /></div>,
          thead: ({node, ...props}) => <thead className="bg-google-gray-50" {...props} />,
          tbody: ({node, ...props}) => <tbody className="divide-y divide-google-gray-200 bg-white" {...props} />,
          tr: ({node, ...props}) => <tr className="hover:bg-google-gray-50 transition-colors" {...props} />,
          th: ({node, ...props}) => <th className="px-4 py-3 text-left text-xs font-medium text-google-gray-700 uppercase tracking-wider border-b border-google-gray-200" {...props} />,
          td: ({node, ...props}) => <td className="px-4 py-3 text-sm text-google-gray-800 break-words" {...props} />,
          input: ({node, type, ...props}) => type === 'checkbox' ? <input type="checkbox" className="w-4 h-4 text-google-blue-600 rounded border-google-gray-300 focus:ring-google-blue-500" disabled {...props} /> : <input type={type} {...props} />
        }}
      >
        {content}
      </Markdown>
    </div>
  );

  return (
    <motion.main 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex justify-center py-6 px-4 sm:px-8 pb-12 w-full max-w-7xl"
    >
      <div className="w-full flex">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center text-[20px] sm:text-[22px] text-google-gray-800 mb-2 font-medium tracking-tight flex-wrap">
                <button onClick={() => onProfileClick(repoOwner)} className="text-google-blue-600 cursor-pointer hover:underline">{repoOwner}</button>
                <span className="mx-2 text-google-gray-400 font-light">/</span>
                <button className="font-bold cursor-pointer hover:underline break-all">{repoName}</button>
                <span className="ml-0 sm:ml-3 mt-2 sm:mt-0 px-2 py-0.5 text-xs font-semibold rounded-full border border-google-gray-200 text-google-gray-500 flex items-center bg-white cursor-auto shrink-0">
                  <Shield className="w-3 h-3 mr-1" />
                  Public
                </span>
              </div>
              {currentPath && (
                <div className="flex items-center text-sm text-google-gray-600 bg-google-gray-100 px-3 py-1.5 rounded-full mt-2 w-fit">
                   <Folder className="w-4 h-4 mr-2" />
                   {currentPath}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <div className="flex shadow-sm rounded-md overflow-hidden">
                <div className="flex items-center px-3 py-1.5 bg-white border border-google-gray-200 text-sm font-medium text-google-gray-700">
                  <GitFork className="w-4 h-4 mr-2" />
                  Fork
                  <span className="ml-2 px-2 py-0.5 bg-google-gray-100 rounded-full text-xs font-semibold">{repoData?.forks_count?.toLocaleString() || 0}</span>
                </div>
              </div>
              <div className="flex shadow-sm rounded-md overflow-hidden">
                <div className="flex items-center px-3 py-1.5 bg-white border border-google-gray-200 text-sm font-medium text-google-gray-700">
                  <Star className="w-4 h-4 mr-2" />
                  Star
                  <span className="ml-2 px-2 py-0.5 bg-google-gray-100 rounded-full text-xs font-semibold">{repoData?.stargazers_count?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          </div>
  
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button className="flex items-center px-3 py-1.5 bg-google-gray-50 border border-google-gray-200 rounded-md text-sm font-medium text-google-gray-800 hover:bg-google-gray-100 transition-colors">
                <GitBranch className="w-4 h-4 mr-2 text-google-gray-500" />
                {repoData?.default_branch || 'main'}
                <ChevronDown className="w-4 h-4 ml-1 text-google-gray-500" />
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 relative">
              <button onClick={() => {
                const el = document.getElementById('code-dropdown');
                if (el) el.classList.toggle('hidden');
              }} className="flex items-center px-4 py-1.5 bg-google-blue-600 border border-google-blue-700 rounded-md text-sm font-medium text-white hover:bg-google-blue-700 transition-colors shadow-sm ml-1">
                <Code2 className="w-4 h-4 mr-2" />
                Code
                <ChevronDown className="w-4 h-4 ml-1 opacity-80" />
              </button>
              <div id="code-dropdown" className="hidden absolute top-10 right-0 w-80 bg-white border border-google-gray-200 rounded-md shadow-lg z-50 p-4">
                <h4 className="font-semibold text-sm mb-2 text-google-gray-800">Clone</h4>
                <div>
                  <div className="text-xs font-semibold text-google-gray-600 mb-1">HTTPS</div>
                  <div className="flex items-center border border-google-gray-200 rounded-md overflow-hidden bg-google-gray-50 mb-3">
                    <input type="text" readOnly value={`https://github.com/${repoOwner}/${repoName}.git`} className="flex-1 bg-transparent text-xs p-2 outline-none text-google-gray-800" />
                    <button onClick={() => navigator.clipboard.writeText(`https://github.com/${repoOwner}/${repoName}.git`)} className="px-2 py-2 hover:bg-google-gray-200 transition-colors">
                      <Book className="w-4 h-4 text-google-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="border border-google-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {!fileContent && (
              <div className="flex flex-col min-w-0 md:flex-row md:items-center justify-between p-4 bg-google-gray-50/50">
                <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden mb-3 md:mb-0">
                  <button onClick={() => commit?.author?.login && onProfileClick(commit.author.login)}>
                    <img 
                      src={commit?.author?.avatar_url || `https://github.com/${repoOwner}.png`} 
                      alt="Avatar" 
                      className="w-6 h-6 rounded-full shrink-0"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }}
                    />
                  </button>
                  <button onClick={() => commit?.author?.login && onProfileClick(commit.author.login)} className="font-semibold text-sm text-google-gray-800 shrink-0 hover:text-google-blue-600">
                    {commit?.commit?.author?.name || repoOwner}
                  </button>
                  <button className="text-sm text-google-gray-700 truncate min-w-0 max-w-full hover:text-google-blue-600">
                    {commitMsg}
                  </button>
                </div>
                <div className="flex items-center flex-wrap gap-3 mt-2 md:mt-0 md:ml-4 shrink-0 md:text-right">
                  <button className="flex items-center text-sm font-mono text-google-gray-600 bg-google-gray-100/80 px-2 py-0.5 rounded cursor-pointer hover:bg-google-gray-200 transition-colors">
                    <Check className="w-3.5 h-3.5 mr-1.5 text-google-green-600" />
                    {commitOid}
                  </button>
                  <span className="text-sm text-google-gray-500 w-20 truncate">{commitDate}</span>
                  <button className="flex items-center text-sm font-semibold text-google-gray-700 hover:text-google-blue-600 transition-colors">
                    <History className="w-4 h-4 mr-1.5 opacity-70" />
                    Commits
                  </button>
                </div>
              </div>
            )}
  
            <div className="flex flex-col">
              {isLoading && (
                <div className="p-8 text-center text-google-gray-500 text-sm">
                  Loading...
                </div>
              )}
              {!isLoading && fileContent !== null && (
                <div className="flex flex-col">
                   <div className="border-b border-google-gray-200 bg-google-gray-50 px-4 py-2 flex items-center">
                      <button onClick={() => {
                        const parts = currentPath.split('/');
                        parts.pop();
                        onNavigate(parts.join('/'));
                      }} className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                      </button>
                   </div>
                   {currentPath.toLowerCase().endsWith('.md') ? (
                     renderMarkdown(fileContent)
                   ) : currentPath.toLowerCase() === 'license' || currentPath.toLowerCase() === 'license.txt' ? (
                     <div className="bg-white p-8">
                       <pre className="overflow-x-auto text-[13px] sm:text-[14px] font-mono leading-relaxed text-google-gray-800 whitespace-pre-wrap break-words max-w-3xl">
                          {fileContent}
                       </pre>
                     </div>
                   ) : (
                     <pre className="p-4 overflow-x-auto text-sm font-mono text-google-gray-800 whitespace-pre-wrap break-words">
                        {fileContent}
                     </pre>
                   )}
                </div>
              )}
              {!isLoading && fileContent === null && (
                <>
                  {currentPath && (
                    <button 
                      onClick={() => {
                        const parts = currentPath.split('/');
                        parts.pop();
                        onNavigate(parts.join('/'));
                      }}
                      className="w-full flex items-center py-2.5 px-4 border-t border-google-gray-200 hover:bg-google-gray-50 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5 mr-3 shrink-0 text-google-gray-500" />
                      <span className="text-sm font-medium text-google-gray-800">..</span>
                    </button>
                  )}
                  {contents.map((item) => (
                    <FileRow 
                      key={item.path}
                      icon={item.type === 'dir' ? Folder : FileText} 
                      name={item.name} 
                      isDir={item.type === 'dir'}
                      onClick={() => onNavigate(item.path)}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
          
          {!fileContent && !isLoading && readmeContent && (
            <div className="mt-6 border border-google-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="px-4 py-3 border-b border-google-gray-200 bg-google-gray-50 flex items-center font-semibold text-sm text-google-gray-800">
                <BookOpen className="w-4 h-4 mr-2" />
                README.md
              </div>
              {renderMarkdown(readmeContent)}
            </div>
          )}
        </div>
        
        <RightSidebar repoData={repoData} releases={releases} repoOwner={repoOwner} repoName={repoName} apiUrl={apiUrl} />
      </div>
    </motion.main>
  );
};

const UserProfileView = ({ username, onSelectRepo, apiUrl }: { username: string, onSelectRepo: (owner: string, repo: string) => void, apiUrl: string }) => {
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchJson(`${apiUrl}/users/${username}`)
      .then(data => {
        setUser(data);
        return fetchJson(`${apiUrl}/users/${username}/repos?sort=updated&per_page=15`);
      })
      .then(data => {
        if (Array.isArray(data)) setRepos(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [username]);

  if (isLoading) {
    return <div className="p-8 text-center text-google-gray-500 w-full mt-10">Loading profile...</div>;
  }

  if (!user || user.message === "Not Found") {
    return <div className="p-8 text-center text-google-gray-500 w-full mt-10">User not found.</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex-1 py-6 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 overflow-y-auto"
    >
      {/* Left Sidebar for User Details */}
      <div className="w-full md:w-72 shrink-0 flex flex-col">
        <img src={user.avatar_url} alt={user.login} className="w-full max-w-[280px] h-auto rounded-full border border-google-gray-200 mb-4" />
        <h1 className="text-2xl font-bold text-google-gray-800">{user.name}</h1>
        <h2 className="text-xl text-google-gray-500 font-light mb-4">{user.login}</h2>
        
        {user.bio && <p className="text-google-gray-800 text-sm mb-4 leading-relaxed">{user.bio}</p>}
        
        <div className="flex items-center text-sm text-google-gray-700 mb-4 gap-4">
          <div className="flex items-center">
            <Activity className="w-4 h-4 mr-1.5 opacity-70" />
            <span className="font-semibold text-google-gray-800 mr-1">{user.followers}</span> followers
          </div>
          <div className="flex items-center mt-1 sm:mt-0">
             <span className="font-semibold text-google-gray-800 mr-1">{user.following}</span> following
          </div>
        </div>

        {user.location && (
          <div className="flex items-center text-sm text-google-gray-700 mb-2">
            <span className="mr-2">📍</span> {user.location}
          </div>
        )}
        
        {user.blog && (
          <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer" className="flex items-center text-sm text-google-blue-600 hover:underline mb-6">
            <Link2 className="w-4 h-4 mr-2" />
            {user.blog}
          </a>
        )}

        <a href={user.html_url} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-2 bg-google-gray-100 hover:bg-google-gray-200 text-google-gray-800 font-medium rounded-md text-sm transition-colors border border-google-gray-300">
          View Original Profile
        </a>
      </div>

      {/* Main content for Repositories */}
      <div className="flex-1 min-w-0">
        <div className="border-b border-google-gray-200 mb-4 pb-2">
          <h3 className="text-lg font-semibold text-google-gray-800">Popular Repositories</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {repos.map(r => (
            <div key={r.id} className="border border-google-gray-200 rounded-xl p-4 hover:border-google-gray-300 bg-white transition-colors flex flex-col items-start text-left cursor-pointer" onClick={() => onSelectRepo(r.owner.login, r.name)}>
              <div className="flex items-center justify-between w-full mb-2">
                <button className="text-google-blue-600 font-semibold hover:underline text-base truncate pr-2">{r.name}</button>
                <span className="text-xs px-2 py-0.5 rounded-full border border-google-gray-200 text-google-gray-500 bg-google-gray-50 shrink-0">
                  {r.private ? 'Private' : 'Public'}
                </span>
              </div>
              <p className="text-sm text-google-gray-600 mb-4 line-clamp-2 w-full">
                {r.description || 'No description available.'}
              </p>
              <div className="mt-auto flex items-center text-xs text-google-gray-500 gap-4 w-full">
                {r.language && (
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-google-blue-600 mr-2"></span>
                    {r.language}
                  </div>
                )}
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 opacity-70" />
                  {r.stargazers_count}
                </div>
                <div className="flex items-center">
                  <GitFork className="w-4 h-4 mr-1 opacity-70" />
                  {r.forks_count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [viewMode, setViewMode] = useState<'home' | 'repo' | 'user'>('home');
  const [profileUsername, setProfileUsername] = useState('');

  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [activeTab, setActiveTab] = useState('code');

  const [apiUrl, setApiUrl] = useState('https://api.github.com');
  const [repoData, setRepoData] = useState<any>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [commit, setCommit] = useState<any>(null);
  const [releases, setReleases] = useState<any[]>([]);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRepoData = () => {
    fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}`)
      .then(data => setRepoData(data))
      .catch(console.error);

    fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}/commits?per_page=1`)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCommit(data[0]);
        }
      })
      .catch(console.error);

    fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}/releases`)
      .then(data => {
        if (Array.isArray(data)) {
          setReleases(data);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchRepoData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoOwner, repoName]);

  useEffect(() => {
    setIsLoading(true);
    setFileContent(null);
    setReadmeContent(null);
    const url = currentPath 
      ? `${apiUrl}/repos/${repoOwner}/${repoName}/contents/${currentPath}`
      : `${apiUrl}/repos/${repoOwner}/${repoName}/contents`;

    fetchJson(url)
      .then(data => {
        if (Array.isArray(data)) {
          const dirs = data.filter(d => d.type === 'dir');
          const files = data.filter(d => d.type === 'file');
          setContents([...dirs, ...files]);
          setFileContent(null);
          
          const readmeFile = data.find((d: any) => d.name.toLowerCase() === 'readme.md');
          if (readmeFile && readmeFile.download_url) {
            fetch(readmeFile.download_url)
              .then(r => r.ok ? r.text() : Promise.reject(new Error('Bad text status')))
              .then(text => setReadmeContent(text))
              .catch(() => setReadmeContent(null));
          } else {
            setReadmeContent(null);
          }
        } else if (data && data.type === 'file') {
          // Decode content
          if (data.content && data.encoding === 'base64') {
            try {
              const text = atob(data.content);
              setFileContent(text);
            } catch (e) {
              setFileContent("Error decoding file contents.");
            }
          } else {
            setFileContent("Cannot display file contents natively.");
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setContents([]);
        setFileContent("Error loading contents.");
        setIsLoading(false);
      });
  }, [repoOwner, repoName, currentPath]);

  const handleSearch = (val: string) => {
    let owner = val;
    let repo = '';
    let currApiUrl = 'https://api.github.com';
    
    const match = val.match(/^(gitea|forgejo|codeberg):\s*(.+)$/i);
    let searchVal = val;
    if (match) {
      searchVal = match[2];
      try {
        if (searchVal.startsWith('http')) {
          const url = new URL(searchVal);
          const parts = url.pathname.split('/').filter(Boolean);
          if (parts.length >= 2) {
             owner = parts[0];
             repo = parts[1];
             currApiUrl = `${url.origin}/api/v1`;
          } else if (parts.length === 1) {
             owner = parts[0];
             currApiUrl = `${url.origin}/api/v1`;
          }
        } else {
           const parts = searchVal.split('/').filter(Boolean);
           if (parts.length >= 2) {
             owner = parts[0];
             repo = parts[1];
           } else {
             owner = parts[0];
           }
           if (match[1].toLowerCase() === 'codeberg') {
             currApiUrl = 'https://codeberg.org/api/v1';
           }
        }
      } catch (e) {
         console.error(e);
      }
    } else {
      try {
        if (val.includes('github.com')) {
          const urlStr = val.startsWith('http') ? val : `https://${val}`;
          const url = new URL(urlStr);
          const parts = url.pathname.split('/').filter(Boolean);
          if (parts.length >= 2) {
            owner = parts[0];
            repo = parts[1];
          } else if (parts.length === 1) {
            owner = parts[0];
          }
        } else {
          const parts = val.split('/').filter(Boolean);
          if (parts.length >= 2) {
            owner = parts[0];
            repo = parts[1];
          } else if (parts.length === 1) {
            owner = parts[0];
          }
        }
      } catch(err) {
         const parts = val.split('/').filter(Boolean);
         if(parts.length >= 2) {
           owner = parts[0];
           repo = parts[1];
         } else if (parts.length === 1) {
           owner = parts[0];
         }
      }
    }

    setApiUrl(currApiUrl);

    if (owner && repo) {
      setRepoOwner(owner);
      setRepoName(repo);
      setCurrentPath('');
      setActiveTab('code');
      setViewMode('repo');
    } else if (owner && !repo) {
      setProfileUsername(owner);
      setViewMode('user');
    }
  };

  return (
    <div className="min-h-screen bg-white text-google-gray-800 font-sans antialiased text-left selection:bg-google-blue-100 selection:text-google-blue-800 flex flex-col items-stretch">
      <TopNav onSearch={handleSearch} onLogoClick={() => {
        setViewMode('home');
        setRepoOwner('');
        setRepoName('');
        setProfileUsername('');
        setCurrentPath('');
      }} repoOwner={repoOwner} onAvatarClick={() => {
        setProfileUsername(repoOwner);
        setViewMode('user');
      }} />
      <div className="flex flex-1 flex-col md:flex-row h-auto min-h-[calc(100vh-64px)] overflow-hidden items-start align-top">
        {viewMode === 'repo' && (
           <SideNav 
             repoData={repoData} 
             activeTab={activeTab} 
             onTabChange={(tab: string) => {
               if (tab === 'code') setCurrentPath('');
               setActiveTab(tab);
             }} 
           />
        )}
        <div className="flex-1 overflow-x-hidden overflow-y-auto w-full self-stretch align-top flex relative">
          <AnimatePresence mode="wait">
            {viewMode === 'home' ? (
              <LandingPage key="home" onSearch={handleSearch} />
            ) : viewMode === 'user' ? (
              <UserProfileView 
                key="user-profile"
                username={profileUsername} 
                apiUrl={apiUrl}
                onSelectRepo={(o, r) => {
                  setRepoOwner(o);
                  setRepoName(r);
                  setCurrentPath('');
                  setActiveTab('code');
                  setViewMode('repo');
                }} 
              />
            ) : (
              activeTab === 'code' ? (
                <MainContent 
                  key="main-content"
                  repoOwner={repoOwner}
                  repoName={repoName}
                  currentPath={currentPath}
                  repoData={repoData} 
                  contents={contents} 
                  commit={commit} 
                  releases={releases} 
                  fileContent={fileContent}
                  readmeContent={readmeContent}
                  isLoading={isLoading}
                  apiUrl={apiUrl}
                  onNavigate={(path) => setCurrentPath(path)}
                  onProfileClick={(uname) => {
                    setProfileUsername(uname);
                    setViewMode('user');
                  }}
                />
              ) : activeTab === 'issues' ? (
                <IssuesTab key="issues" repoOwner={repoOwner} repoName={repoName} apiUrl={apiUrl} />
              ) : activeTab === 'pulls' ? (
                <PullsTab key="pulls" repoOwner={repoOwner} repoName={repoName} apiUrl={apiUrl} />
              ) : activeTab === 'actions' ? (
                <GenericListTab key="actions" repoOwner={repoOwner} repoName={repoName} apiUrl={apiUrl} endpoint="actions/runs" title="Actions" icon={PlayCircle} emptyText="No workflow runs found." />
              ) : activeTab === 'projects' ? (
                <GenericListTab key="projects" repoOwner={repoOwner} repoName={repoName} apiUrl={apiUrl} endpoint="projects" title="Projects" icon={LayoutGrid} emptyText="No projects found." />
              ) : activeTab === 'discussions' ? (
                <GenericListTab key="discussions" repoOwner={repoOwner} repoName={repoName} apiUrl={apiUrl} endpoint="discussions" title="Discussions" icon={MessageSquare} emptyText="No discussions found." />
              ) : activeTab === 'security' ? (
                <GenericListTab key="security" repoOwner={repoOwner} repoName={repoName} apiUrl={apiUrl} endpoint="dependabot/alerts" title="Security Alerts" icon={Shield} emptyText="No security alerts." />
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="w-16 h-16 bg-google-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Info className="w-8 h-8 text-google-gray-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-google-gray-800 mb-3 capitalize">{activeTab}</h2>
                  <p className="text-google-gray-600 max-w-md">
                    This view is not fully implemented in this custom instance yet.
                  </p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
