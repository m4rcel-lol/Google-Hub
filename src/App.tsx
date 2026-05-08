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
  Home,
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
  ArrowLeft,
  Users,
  MapPin,
  Building2,
  Calendar,
  Mail,
  Github,
  Package,
} from "lucide-react";
import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const fetchJson = async (url: string) => {
  const proxiedUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
  let res;
  try {
    res = await fetch(proxiedUrl);
  } catch (err: any) {
    throw new Error(`Connection error on ${proxiedUrl}: ${err.message}`);
  }
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok && res.status !== 403 && res.status !== 404) {
      throw new Error(`Failed to fetch: ${res.status} ${data.message || ""}`);
    }
    return data;
  } catch (e: any) {
    if (!res.ok) {
      // Return a structured error object if not JSON, instead of throwing generic errors that look like unresolved crashes
      return { message: `Failed to fetch: ${res.status}`, type: "error" };
    }
    return { message: "Invalid JSON response", type: "error" };
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
  const [val, setVal] = useState("");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-start p-6 md:p-8 min-h-full max-w-5xl mx-auto w-full pt-12 md:pt-20"
    >
      <div className="w-full text-center space-y-6">
        <div className="flex justify-center mb-8">
          <div className="text-[48px] md:text-[56px] font-medium tracking-tight select-none flex items-center">
            <span className="text-[#2f81f7]">G</span>
            <span className="text-[#f85149]">o</span>
            <span className="text-[#e3b341]">o</span>
            <span className="text-[#2f81f7]">g</span>
            <span className="text-[#3fb950]">l</span>
            <span className="text-[#f85149]">e</span>
            <span className="ml-3 text-google-gray-800">Hub</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-google-gray-800 tracking-tight">
          A clean perspective on Git repositories
        </h1>
        <p className="text-google-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Search for any public repository, user, or organization on GitHub,
          Gitea, Forgejo, or Codeberg. View source code, issues, and activity
          through a focused interface with Google-inspired aesthetics.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (val.trim()) onSearch(val.trim());
          }}
          className="mt-8 relative max-w-2xl mx-auto"
        >
          <div className="flex items-center w-full h-14 bg-white rounded-full px-6 border hover:shadow-md border-google-gray-200 focus-within:shadow-md focus-within:border-white transition-all shadow-sm group">
            <Search className="w-5 h-5 text-google-gray-500 shrink-0 group-focus-within:text-google-blue-600 transition-colors" />
            <input
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Search e.g., facebook/react or https://codeberg.org/..."
              className="flex-1 bg-transparent border-none outline-none px-4 text-[15px] md:text-[16px] text-google-gray-800 placeholder-google-gray-400 w-full min-w-0"
            />
            <button
              type="submit"
              className="bg-google-blue-600 hover:bg-google-blue-700 text-white px-5 py-2 rounded-full font-medium text-sm transition-colors shadow-sm hidden sm:block"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="mt-16 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          className="bg-white border border-google-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left flex flex-col group"
          onClick={() => onSearch("facebook/react")}
        >
          <div className="w-10 h-10 rounded-full bg-google-blue-50 flex items-center justify-center mb-4 text-google-blue-600 group-hover:scale-110 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-google-gray-800 mb-2 truncate group-hover:text-google-blue-600 transition-colors">
            facebook/react
          </h3>
          <p className="text-sm text-google-gray-500 flex-1 leading-relaxed">
            Explore the React UI library's source code, components, and
            architecture.
          </p>
          <div className="mt-4 text-xs font-semibold text-google-gray-400 uppercase tracking-wider flex items-center">
            <Github className="w-3.5 h-3.5 mr-1.5 opacity-70" /> GitHub
          </div>
        </div>

        <div
          className="bg-white border border-google-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left flex flex-col group"
          onClick={() =>
            onSearch("codeberg: https://codeberg.org/forgejo/forgejo")
          }
        >
          <div className="w-10 h-10 rounded-full bg-google-green-50 flex items-center justify-center mb-4 text-google-green-600 group-hover:scale-110 transition-transform">
            <GitBranch className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-google-gray-800 mb-2 line-clamp-1 group-hover:text-google-blue-600 transition-colors">
            forgejo/forgejo
          </h3>
          <p className="text-sm text-google-gray-500 flex-1 leading-relaxed">
            Beyond GitHub: view the codebase of Forgejo hosted on a community
            instance.
          </p>
          <div className="mt-4 text-xs font-semibold text-google-gray-400 uppercase tracking-wider flex items-center">
            <Package className="w-3.5 h-3.5 mr-1.5 opacity-70" /> Codeberg
          </div>
        </div>

        <div
          className="bg-white border border-google-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left flex flex-col group"
          onClick={() => onSearch("gitea: https://gitea.com/gitea/go-sdk")}
        >
          <div className="w-10 h-10 rounded-full bg-[#fbbc04]/10 flex items-center justify-center mb-4 text-[#fbbc04] group-hover:scale-110 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-google-gray-800 mb-2 truncate group-hover:text-google-blue-600 transition-colors">
            gitea/go-sdk
          </h3>
          <p className="text-sm text-google-gray-500 flex-1 leading-relaxed">
            Check out Gitea's Go SDK repository hosted natively on their own
            instance.
          </p>
          <div className="mt-4 text-xs font-semibold text-google-gray-400 uppercase tracking-wider flex items-center">
            <Package className="w-3.5 h-3.5 mr-1.5 opacity-70" /> Gitea
          </div>
        </div>
      </div>

      <div className="mt-20 text-center w-full">
        <h3 className="text-xs uppercase tracking-widest text-google-gray-400 font-semibold mb-6">
          Supported Platforms
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="font-bold text-lg md:text-xl tracking-tight text-google-gray-700 flex items-center hover:text-black transition-colors">
            <Github className="w-5 h-5 md:w-6 md:h-6 mr-2" /> GitHub
          </div>
          <div className="font-bold text-lg md:text-xl tracking-tight text-google-gray-700 hover:text-black transition-colors flex items-center">
            <Package className="w-5 h-5 md:w-6 md:h-6 mr-2" /> Gitea
          </div>
          <div className="font-bold text-lg md:text-xl tracking-tight text-google-gray-700 hover:text-black transition-colors flex items-center">
            <GitBranch className="w-5 h-5 md:w-6 md:h-6 mr-2" /> Forgejo
          </div>
          <div className="font-bold text-lg md:text-xl tracking-tight text-google-gray-700 hover:text-black transition-colors flex items-center">
            <Code2 className="w-5 h-5 md:w-6 md:h-6 mr-2" /> Codeberg
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TopNav = ({
  onSearch,
  onLogoClick,
  repoOwner,
  onAvatarClick,
  viewMode,
  canGoBack,
  onGoBack,
}: {
  onSearch: (val: string) => void;
  onLogoClick: () => void;
  repoOwner: string;
  onAvatarClick?: () => void;
  viewMode?: "home" | "repo" | "user";
  canGoBack?: boolean;
  onGoBack?: () => void;
}) => {
  const [val, setVal] = useState("");
  return (
    <header className="flex h-16 items-center justify-between border-b border-google-gray-200 px-4 md:px-6 shrink-0 bg-white z-10 sticky top-0">
      <div className="flex items-center w-auto md:w-64 shrink-0 mr-4">
        <div
          className="flex items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
          onClick={onLogoClick}
        >
          <GoogleLogo />
        </div>
        {canGoBack && onGoBack && (
          <button
            onClick={onGoBack}
            className="ml-3 sm:ml-5 flex items-center justify-center p-2 rounded-full hover:bg-google-gray-50 text-google-gray-500 hover:text-google-gray-800 transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        {viewMode && viewMode !== "home" && (
          <button
            onClick={onLogoClick}
            className="ml-1 flex items-center justify-center p-2 rounded-full hover:bg-google-gray-50 text-google-gray-500 hover:text-google-gray-800 transition-colors"
            title="Return Home"
          >
            <Home className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 max-w-2xl px-2 md:px-4 block">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (val.trim()) onSearch(val.trim());
          }}
          className="flex items-center w-full h-10 md:h-12 bg-google-gray-100 rounded-full px-4 border border-transparent hover:border-google-gray-200 focus-within:bg-white focus-within:border-google-gray-200 focus-within:shadow-sm transition-colors"
        >
          <Search className="w-5 h-5 text-google-gray-500 shrink-0" />
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Search repo, user, or gitea: url..."
            className="flex-1 bg-transparent border-none outline-none px-3 text-sm md:text-[15px] text-google-gray-800 placeholder-google-gray-500 w-full min-w-0"
          />
          <button
            type="submit"
            className="hidden md:flex items-center justify-center w-6 h-6 rounded bg-white text-google-gray-500 text-xs border border-google-gray-200 shadow-sm shrink-0 font-medium hover:bg-google-gray-50 cursor-pointer"
          >
            /
          </button>
        </form>
      </div>
    </header>
  );
};

const SideNavItem = ({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-google-blue-50 text-google-blue-700"
          : "text-google-gray-700 hover:bg-google-gray-50"
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon
          className={`w-5 h-5 ${active ? "text-google-blue-600" : "text-google-gray-500"}`}
        />
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

const SideNav = ({
  repoData,
  activeTab,
  onTabChange,
}: {
  repoData: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => (
  <aside className="w-[280px] shrink-0 border-r border-google-gray-200 h-full hidden md:flex flex-col pt-4 pb-6 px-3 bg-white overflow-y-auto">
    <nav className="flex-1 space-y-1">
      <SideNavItem
        icon={Code2}
        label="Code"
        active={activeTab === "code"}
        onClick={() => onTabChange("code")}
      />
      <SideNavItem
        icon={CircleDot}
        label="Issues"
        count={repoData?.open_issues_count || 0}
        active={activeTab === "issues"}
        onClick={() => onTabChange("issues")}
      />
      <SideNavItem
        icon={GitPullRequest}
        label="Pull requests"
        active={activeTab === "pulls"}
        onClick={() => onTabChange("pulls")}
      />
      <SideNavItem
        icon={MessageSquare}
        label="Discussions"
        active={activeTab === "discussions"}
        onClick={() => onTabChange("discussions")}
      />
      <SideNavItem
        icon={PlayCircle}
        label="Actions"
        active={activeTab === "actions"}
        onClick={() => onTabChange("actions")}
      />
      <SideNavItem
        icon={LayoutGrid}
        label="Projects"
        active={activeTab === "projects"}
        onClick={() => onTabChange("projects")}
      />
      <SideNavItem
        icon={Book}
        label="Wiki"
        active={activeTab === "wiki"}
        onClick={() => onTabChange("wiki")}
      />
      <SideNavItem
        icon={Shield}
        label="Security"
        active={activeTab === "security"}
        onClick={() => onTabChange("security")}
      />
      <SideNavItem
        icon={LineChart}
        label="Insights"
        active={activeTab === "insights"}
        onClick={() => onTabChange("insights")}
      />
    </nav>
  </aside>
);

const MobileNavItem = ({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
      active
        ? "border-google-blue-600 text-google-blue-600"
        : "border-transparent text-google-gray-600 hover:text-google-gray-800 hover:border-google-gray-300"
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

const MobileNav = ({
  repoData,
  activeTab,
  onTabChange,
}: {
  repoData: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => (
  <nav className="md:hidden flex overflow-x-auto border-b border-google-gray-200 bg-white w-full shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    <MobileNavItem
      icon={Code2}
      label="Code"
      active={activeTab === "code"}
      onClick={() => onTabChange("code")}
    />
    <MobileNavItem
      icon={CircleDot}
      label="Issues"
      active={activeTab === "issues"}
      onClick={() => onTabChange("issues")}
    />
    <MobileNavItem
      icon={GitPullRequest}
      label="Pull requests"
      active={activeTab === "pulls"}
      onClick={() => onTabChange("pulls")}
    />
    <MobileNavItem
      icon={MessageSquare}
      label="Discussions"
      active={activeTab === "discussions"}
      onClick={() => onTabChange("discussions")}
    />
    <MobileNavItem
      icon={PlayCircle}
      label="Actions"
      active={activeTab === "actions"}
      onClick={() => onTabChange("actions")}
    />
    <MobileNavItem
      icon={LayoutGrid}
      label="Projects"
      active={activeTab === "projects"}
      onClick={() => onTabChange("projects")}
    />
    <MobileNavItem
      icon={Book}
      label="Wiki"
      active={activeTab === "wiki"}
      onClick={() => onTabChange("wiki")}
    />
    <MobileNavItem
      icon={Shield}
      label="Security"
      active={activeTab === "security"}
      onClick={() => onTabChange("security")}
    />
    <MobileNavItem
      icon={LineChart}
      label="Insights"
      active={activeTab === "insights"}
      onClick={() => onTabChange("insights")}
    />
  </nav>
);

const GenericListTab = ({
  repoOwner,
  repoName,
  apiUrl,
  endpoint,
  title,
  icon: Icon,
  emptyText,
}: {
  repoOwner: string;
  repoName: string;
  apiUrl: string;
  endpoint: string;
  title: string;
  icon: any;
  emptyText: string;
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}/${endpoint}`)
      .then((data) => {
        setItems(
          Array.isArray(data)
            ? data
            : data.workflow_runs || data.projects || [],
        );
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [repoOwner, repoName, apiUrl, endpoint]);

  if (selectedItem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 py-6 px-4 md:px-8 max-w-5xl mx-auto w-full"
      >
        <div className="mb-6">
          <button
            onClick={() => setSelectedItem(null)}
            className="flex items-center text-sm font-medium text-google-gray-500 hover:text-google-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to{" "}
            {title.toLowerCase()}
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-google-gray-900 leading-tight mb-2">
                {selectedItem.title ||
                  selectedItem.name ||
                  selectedItem.display_title ||
                  `Item #${selectedItem.id}`}
              </h2>
              <div className="flex items-center gap-3 text-sm flex-wrap">
                {(selectedItem.state || selectedItem.status) && (
                  <span className="px-3 py-1 bg-google-gray-200 text-google-gray-800 rounded-full font-medium flex items-center shadow-sm">
                    <Icon className="w-4 h-4 mr-1.5 object-contain" />{" "}
                    {selectedItem.state || selectedItem.status}
                  </span>
                )}
                <span className="text-google-gray-600">
                  {selectedItem.user?.login && (
                    <span className="font-semibold text-google-gray-800">
                      {selectedItem.user.login}
                    </span>
                  )}
                  {selectedItem.updated_at || selectedItem.created_at
                    ? ` updated on ${new Date(selectedItem.updated_at || selectedItem.created_at).toLocaleDateString()}`
                    : ""}
                </span>
              </div>
            </div>
            {selectedItem.html_url && (
              <a
                href={selectedItem.html_url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 px-4 py-2 bg-white border border-google-gray-200 text-google-blue-600 font-semibold text-sm rounded-lg hover:bg-google-gray-50 transition-colors shadow-sm"
              >
                View on Origin
              </a>
            )}
          </div>
        </div>
        <div className="bg-white border border-google-gray-200 rounded-xl overflow-hidden shadow-sm">
          {selectedItem.body ? (
            <MarkdownViewer content={selectedItem.body} />
          ) : (
            <div className="p-8 text-google-gray-500 italic">
              No description or markdown content provided.
            </div>
          )}
        </div>
      </motion.div>
    );
  }

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
          {loading
            ? "Loading..."
            : error
              ? "Error or Unsupported"
              : `${items.length} ${title}`}
        </div>

        <div className="divide-y divide-google-gray-200">
          {loading ? (
            <div className="p-8 text-center text-google-gray-500">
              Loading {title.toLowerCase()}...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-google-gray-500">
              <Icon className="w-8 h-8 mx-auto mb-3 opacity-50" />
              Not available for this provider or repository.
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center">
              <Icon className="w-8 h-8 text-google-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-google-gray-800">
                {emptyText}
              </h3>
            </div>
          ) : (
            items.map((item, i) => (
              <div
                key={item.id || i}
                className="p-4 hover:bg-google-gray-50 transition-colors flex items-start gap-3"
              >
                <Icon className="w-5 h-5 text-google-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-base font-semibold text-google-gray-800 hover:text-google-blue-600 break-words line-clamp-2 mb-1 cursor-pointer text-left"
                  >
                    {item.title ||
                      item.name ||
                      item.display_title ||
                      `Item #${item.id}`}
                  </button>
                  <div className="text-xs text-google-gray-500">
                    {item.state || item.status
                      ? `Status: ${item.state || item.status} • `
                      : ""}
                    {item.updated_at || item.created_at
                      ? `Updated on ${new Date(item.updated_at || item.created_at).toLocaleDateString()}`
                      : ""}
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

export const MarkdownViewer = ({ content }: { content: string }) => (
  <div className="p-6 md:p-8 text-[15px] leading-relaxed w-full min-w-0 max-w-full break-words text-google-gray-800 space-y-4">
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ node, ...props }) => (
          <h1
            className="text-3xl font-bold border-b border-google-gray-200 pb-2 mb-4 mt-6"
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            className="text-2xl font-bold border-b border-google-gray-200 pb-2 mb-4 mt-6"
            {...props}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-bold mb-4 mt-6" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p
            className="mb-4 text-google-gray-800 leading-relaxed break-words"
            {...props}
          />
        ),
        a: ({ node, href, ...props }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-google-blue-600 hover:underline break-words"
            {...props}
          />
        ),
        ul: ({ node, className, ...props }) => (
          <ul
            className={`list-disc pl-5 mb-4 space-y-1 ${className?.includes("contains-task-list") ? "list-none pl-0" : ""}`}
            {...props}
          />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />
        ),
        li: ({ node, className, ...props }) => (
          <li
            className={`break-words ${className?.includes("task-list-item") ? "flex items-center gap-2" : ""}`}
            {...props}
          />
        ),
        code: ({ node, inline, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <div className="mb-4 rounded-md border border-google-gray-200 overflow-hidden text-[13px] bg-google-gray-50">
              <SyntaxHighlighter
                style={atomOneDark as any}
                language={match[1]}
                PreTag="div"
                customStyle={{ margin: 0, background: "transparent" }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code
              className={`${inline ? "px-1.5 py-0.5 rounded-md bg-google-gray-100 text-[13px] font-mono break-words" : "block bg-google-gray-50 p-4 rounded-md overflow-x-auto text-[13px] font-mono break-all mb-4"}`}
              {...props}
            >
              {children}
            </code>
          );
        },
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-google-gray-200 pl-4 text-google-gray-600 italic mb-4"
            {...props}
          />
        ),
        img: ({ node, ...props }) => (
          <img
            className="max-w-full h-auto rounded-md border border-google-gray-200"
            {...props}
          />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto mb-4">
            <table
              className="min-w-full divide-y divide-google-gray-200 border border-google-gray-200"
              {...props}
            />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-google-gray-50" {...props} />
        ),
        tbody: ({ node, ...props }) => (
          <tbody
            className="divide-y divide-google-gray-200 bg-white"
            {...props}
          />
        ),
        tr: ({ node, ...props }) => (
          <tr
            className="hover:bg-google-gray-50 transition-colors"
            {...props}
          />
        ),
        th: ({ node, ...props }) => (
          <th
            className="px-4 py-3 text-left text-xs font-medium text-google-gray-700 uppercase tracking-wider border-b border-google-gray-200"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td
            className="px-4 py-3 text-sm text-google-gray-800 break-words"
            {...props}
          />
        ),
        input: ({ node, type, ...props }) =>
          type === "checkbox" ? (
            <input
              type="checkbox"
              className="w-4 h-4 text-google-blue-600 rounded border-google-gray-300 focus:ring-google-blue-500"
              disabled
              {...props}
            />
          ) : (
            <input type={type} {...props} />
          ),
      }}
    >
      {content}
    </Markdown>
  </div>
);

const IssuesTab = ({
  repoOwner,
  repoName,
  apiUrl,
}: {
  repoOwner: string;
  repoName: string;
  apiUrl: string;
}) => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    fetchJson(
      `${apiUrl}/repos/${repoOwner}/${repoName}/issues?state=open&per_page=30`,
    )
      .then((data) => {
        setIssues(
          Array.isArray(data)
            ? data.filter((issue: any) => !issue.pull_request)
            : [],
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repoOwner, repoName, apiUrl]);

  if (selectedIssue) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 py-6 px-4 md:px-8 max-w-5xl mx-auto w-full"
      >
        <div className="mb-6">
          <button
            onClick={() => setSelectedIssue(null)}
            className="flex items-center text-sm font-medium text-google-gray-500 hover:text-google-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to issues
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-google-gray-900 leading-tight mb-2">
                {selectedIssue.title}{" "}
                <span className="text-google-gray-400 font-normal">
                  #{selectedIssue.number}
                </span>
              </h2>
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <span className="px-3 py-1 bg-google-green-600 text-white rounded-full font-medium flex items-center shadow-sm">
                  <CircleDot className="w-4 h-4 mr-1.5 object-contain" />{" "}
                  {selectedIssue.state}
                </span>
                <span className="text-google-gray-600">
                  <span className="font-semibold text-google-gray-800">
                    {selectedIssue.user.login}
                  </span>{" "}
                  opened this issue on{" "}
                  {new Date(selectedIssue.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            {selectedIssue.html_url && (
              <a
                href={selectedIssue.html_url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 px-4 py-2 bg-white border border-google-gray-200 text-google-blue-600 font-semibold text-sm rounded-lg hover:bg-google-gray-50 transition-colors shadow-sm"
              >
                View on Origin
              </a>
            )}
          </div>
        </div>
        <div className="bg-white border border-google-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-google-gray-50 border-b border-google-gray-200 px-4 py-3 text-sm text-google-gray-700 font-medium flex items-center">
            {selectedIssue.user.login} commented
          </div>
          {selectedIssue.body ? (
            <MarkdownViewer content={selectedIssue.body} />
          ) : (
            <div className="p-8 text-google-gray-500 italic">
              No description provided.
            </div>
          )}
        </div>
      </motion.div>
    );
  }

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
          {loading ? "Loading..." : `${issues.length} Open issues`}
        </div>

        <div className="divide-y divide-google-gray-200">
          {loading ? (
            <div className="p-8 text-center text-google-gray-500">
              Loading issues...
            </div>
          ) : issues.length === 0 ? (
            <div className="p-12 text-center">
              <CircleDot className="w-8 h-8 text-google-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-google-gray-800">
                No open issues
              </h3>
            </div>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 hover:bg-google-gray-50 transition-colors flex items-start gap-3"
              >
                <CircleDot className="w-5 h-5 text-google-green-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => setSelectedIssue(issue)}
                    className="text-base font-semibold text-google-gray-800 hover:text-google-blue-600 break-words line-clamp-2 mb-1 cursor-pointer text-left"
                  >
                    {issue.title}
                  </button>
                  <div className="text-xs text-google-gray-500">
                    #{issue.number} opened on{" "}
                    {new Date(issue.created_at).toLocaleDateString()} by{" "}
                    {issue.user.login}
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

const PullsTab = ({
  repoOwner,
  repoName,
  apiUrl,
}: {
  repoOwner: string;
  repoName: string;
  apiUrl: string;
}) => {
  const [pulls, setPulls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPr, setSelectedPr] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    fetchJson(
      `${apiUrl}/repos/${repoOwner}/${repoName}/pulls?state=open&per_page=30`,
    )
      .then((data) => {
        setPulls(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repoOwner, repoName, apiUrl]);

  if (selectedPr) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 py-6 px-4 md:px-8 max-w-5xl mx-auto w-full"
      >
        <div className="mb-6">
          <button
            onClick={() => setSelectedPr(null)}
            className="flex items-center text-sm font-medium text-google-gray-500 hover:text-google-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to pull requests
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-google-gray-900 leading-tight mb-2">
                {selectedPr.title}{" "}
                <span className="text-google-gray-400 font-normal">
                  #{selectedPr.number}
                </span>
              </h2>
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <span className="px-3 py-1 bg-google-green-600 text-white rounded-full font-medium flex items-center shadow-sm">
                  <GitPullRequest className="w-4 h-4 mr-1.5 object-contain" />{" "}
                  {selectedPr.state}
                </span>
                <span className="text-google-gray-600">
                  <span className="font-semibold text-google-gray-800">
                    {selectedPr.user.login}
                  </span>{" "}
                  opened this pull request on{" "}
                  {new Date(selectedPr.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            {selectedPr.html_url && (
              <a
                href={selectedPr.html_url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 px-4 py-2 bg-white border border-google-gray-200 text-google-blue-600 font-semibold text-sm rounded-lg hover:bg-google-gray-50 transition-colors shadow-sm"
              >
                View on Origin
              </a>
            )}
          </div>
        </div>
        <div className="bg-white border border-google-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-google-gray-50 border-b border-google-gray-200 px-4 py-3 text-sm text-google-gray-700 font-medium flex items-center">
            {selectedPr.user.login} commented
          </div>
          {selectedPr.body ? (
            <MarkdownViewer content={selectedPr.body} />
          ) : (
            <div className="p-8 text-google-gray-500 italic">
              No description provided.
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex-1 py-6 px-4 md:px-8 max-w-7xl mx-auto w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-google-gray-800">
          Pull requests
        </h2>
      </div>

      <div className="border border-google-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="bg-google-gray-50 px-4 py-3 border-b border-google-gray-200 flex items-center font-medium text-sm text-google-gray-700">
          <GitPullRequest className="w-5 h-5 mr-2 text-google-green-600" />
          {loading ? "Loading..." : `${pulls.length} Open pull requests`}
        </div>

        <div className="divide-y divide-google-gray-200">
          {loading ? (
            <div className="p-8 text-center text-google-gray-500">
              Loading pull requests...
            </div>
          ) : pulls.length === 0 ? (
            <div className="p-12 text-center">
              <GitPullRequest className="w-8 h-8 text-google-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-google-gray-800">
                No open pull requests
              </h3>
            </div>
          ) : (
            pulls.map((pr) => (
              <div
                key={pr.id}
                className="p-4 hover:bg-google-gray-50 transition-colors flex items-start gap-3"
              >
                <GitPullRequest className="w-5 h-5 text-google-green-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => setSelectedPr(pr)}
                    className="text-base font-semibold text-google-gray-800 hover:text-google-blue-600 break-words line-clamp-2 mb-1 cursor-pointer text-left"
                  >
                    {pr.title}
                  </button>
                  <div className="text-xs text-google-gray-500">
                    #{pr.number} opened on{" "}
                    {new Date(pr.created_at).toLocaleDateString()} by{" "}
                    {pr.user.login}
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
const RightSidebar = ({
  repoData,
  releases,
  repoOwner,
  repoName,
  apiUrl,
  onTabChange,
}: {
  repoData: any;
  releases: any[];
  repoOwner: string;
  repoName: string;
  apiUrl: string;
  onTabChange: (tab: string) => void;
}) => {
  const topics = repoData?.topics || [];
  const homepage = repoData?.homepage;
  const [languages, setLanguages] = useState<Record<string, number>>({});

  useEffect(() => {
    if (repoOwner && repoName) {
      fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}/languages`)
        .then((data) => {
          if (!data.message) setLanguages(data);
        })
        .catch(console.error);
    }
  }, [repoOwner, repoName, apiUrl]);

  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full xl:w-[320px] shrink-0 pt-6 xl:px-6 order-first xl:order-last pb-6 border-b border-google-gray-200 xl:border-none xl:pb-0 mb-6 xl:mb-0">
      <div className="mb-6">
        <h3 className="font-semibold text-google-gray-800 mb-3 text-base">
          About
        </h3>
        {repoData?.message && repoData?.message !== "Not Found" ? (
          <p className="text-sm text-google-red font-medium leading-relaxed mb-4 text-red-600">
            {repoData.message}
          </p>
        ) : (
          <p className="text-sm text-google-gray-700 leading-relaxed mb-4">
            {repoData?.description || "No description provided."}
          </p>
        )}

        {homepage && (
          <a
            href={
              homepage.startsWith("http") ? homepage : `https://${homepage}`
            }
            target="_blank"
            rel="noreferrer"
            className="flex items-center text-sm font-medium text-google-blue-600 hover:underline mb-4"
          >
            <Link2 className="w-4 h-4 mr-1.5" />
            {homepage}
          </a>
        )}

        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {topics.map((tag: string) => (
              <span
                key={tag}
                className="text-xs font-medium text-google-blue-700 bg-google-blue-50 px-2.5 py-1 rounded-full hover:bg-google-blue-100 cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() =>
              document
                .getElementById("readme-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors w-full text-left"
          >
            <BookOpen className="w-4 h-4 mr-3 text-google-gray-500" />
            Readme
          </button>
          {repoData?.license && (
            <button className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors w-full text-left">
              <Scale className="w-4 h-4 mr-3 text-google-gray-500" />
              {repoData.license.name}
            </button>
          )}
          <button
            onClick={() => onTabChange("activity")}
            className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors w-full text-left"
          >
            <Activity className="w-4 h-4 mr-3 text-google-gray-500" />
            Activity
          </button>
        </div>

        <div className="space-y-3 mt-6">
          <button className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors w-full text-left">
            <Star className="w-4 h-4 mr-3 text-google-gray-500" />
            <span className="font-semibold text-google-gray-800 mr-1">
              {repoData?.stargazers_count?.toLocaleString() || 0}
            </span>{" "}
            stars
          </button>
          <button className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors w-full text-left">
            <GitFork className="w-4 h-4 mr-3 text-google-gray-500" />
            <span className="font-semibold text-google-gray-800 mr-1">
              {repoData?.forks_count?.toLocaleString() || 0}
            </span>{" "}
            forks
          </button>
          <button className="flex items-center text-sm text-google-gray-700 hover:text-google-blue-600 transition-colors w-full text-left">
            <Bell className="w-4 h-4 mr-3 text-google-gray-500" />
            <span className="font-semibold text-google-gray-800 mr-1">
              {repoData?.watchers_count?.toLocaleString() || 0}
            </span>{" "}
            watching
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-google-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button className="font-semibold text-google-gray-800 text-base hover:text-google-blue-600">
            Releases
          </button>
          <span className="text-xs bg-google-gray-100 text-google-gray-700 font-semibold px-2 py-0.5 rounded-full">
            {releases.length}
          </span>
        </div>
        {releases.length > 0 ? (
          <div className="mb-4">
            <button className="flex items-center font-semibold text-google-gray-800 hover:text-google-blue-600 mb-1">
              <Tag className="w-4 h-4 mr-2 text-google-green-600" />
              {releases[0].tag_name}
              <span className="ml-2 text-xs text-google-green-600 border border-current bg-google-green-600/10 px-2 py-[1px] rounded-full">
                Latest
              </span>
            </button>
            <p className="text-xs text-google-gray-500 ml-6">
              {new Date(releases[0].published_at).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="text-sm text-google-gray-500 mb-4">
            No releases published
          </div>
        )}
        {releases.length > 1 && (
          <button className="text-sm text-google-blue-600 hover:underline font-medium">
            + {releases.length - 1} releases
          </button>
        )}
      </div>

      {Object.keys(languages).length > 0 && (
        <div className="pt-6 mt-6 border-t border-google-gray-200">
          <h3 className="font-semibold text-google-gray-800 mb-3 text-base">
            Languages
          </h3>
          <div className="flex w-full h-2 rounded-full overflow-hidden mb-3">
            {Object.entries(languages).map(([lang, bytes], i) => {
              const colors = [
                "bg-google-blue-600",
                "bg-google-red",
                "bg-google-yellow",
                "bg-google-green-600",
                "bg-google-gray-600",
              ];
              return (
                <div
                  key={lang}
                  style={{ width: `${(bytes / totalBytes) * 100}%` }}
                  className={colors[i % colors.length]}
                  title={lang}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {Object.entries(languages).map(([lang, bytes], i) => {
              const colors = [
                "text-google-blue-600",
                "text-google-red",
                "text-google-yellow",
                "text-google-green-600",
                "text-google-gray-600",
              ];
              return (
                <div
                  key={lang}
                  className="flex items-center text-sm text-google-gray-700"
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 bg-current ${colors[i % colors.length]}`}
                  />
                  <span className="font-medium mr-1">{lang}</span>
                  <span className="text-google-gray-500">
                    {((bytes / totalBytes) * 100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const FileRow = ({
  icon: Icon,
  name,
  isDir = false,
  onClick,
}: {
  key?: string;
  icon: any;
  name: string;
  isDir?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center py-2.5 px-4 border-t border-google-gray-200 hover:bg-google-gray-50 transition-colors group cursor-pointer text-left"
  >
    <Icon
      className={`w-5 h-5 mr-3 shrink-0 ${isDir ? "text-google-blue-600 fill-google-blue-600" : "text-google-gray-500"}`}
    />
    <span className="text-sm font-medium text-google-gray-800 truncate group-hover:text-google-blue-600 transition-colors max-w-full">
      {name}
    </span>
  </button>
);

const MainContent = ({
  repoOwner,
  repoName,
  currentPath,
  repoData,
  contents,
  commit,
  releases,
  onNavigate,
  fileContent,
  readmeContent,
  isLoading,
  onProfileClick,
  apiUrl,
  onTabChange,
}: {
  repoOwner: string;
  repoName: string;
  currentPath: string;
  repoData: any;
  contents: any[];
  commit: any;
  releases: any[];
  onNavigate: (path: string) => void;
  fileContent: string | null;
  readmeContent: string | null;
  isLoading: boolean;
  onProfileClick: (username: string) => void;
  apiUrl: string;
  onTabChange: (tab: string) => void;
}) => {
  const commitMsg = commit?.commit?.message
    ? commit.commit.message.split("\n")[0]
    : "Loading...";
  const commitOid = commit?.sha ? commit.sha.substring(0, 7) : "...";
  const commitDate = commit?.commit?.author?.date
    ? new Date(commit.commit.author.date).toLocaleDateString()
    : "";

  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex justify-center py-6 px-4 sm:px-8 pb-12 w-full max-w-7xl"
    >
      <div className="w-full flex flex-col xl:flex-row">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center text-[20px] sm:text-[22px] text-google-gray-800 mb-2 font-medium tracking-tight flex-wrap">
                <button
                  onClick={() => onProfileClick(repoOwner)}
                  className="text-google-blue-600 cursor-pointer hover:underline"
                >
                  {repoOwner}
                </button>
                <span className="mx-2 text-google-gray-400 font-light">/</span>
                <button className="font-bold cursor-pointer hover:underline break-all">
                  {repoName}
                </button>
                <span className="ml-0 sm:ml-3 mt-2 sm:mt-0 px-2 py-0.5 text-xs font-semibold rounded-full border border-google-gray-200 text-google-gray-500 flex items-center bg-white cursor-auto shrink-0">
                  <Shield className="w-3 h-3 mr-1" />
                  {repoData?.private ? "Private" : "Public"}
                </span>
                {repoData?.html_url && (
                  <a
                    href={repoData.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-3 mt-2 sm:mt-0 px-3 py-0.5 text-xs font-semibold rounded-full border border-google-gray-200 text-google-blue-600 hover:bg-google-gray-50 flex items-center bg-white transition-colors shrink-0"
                  >
                    View on Origin
                  </a>
                )}
              </div>
              {currentPath && (
                <div className="flex items-center text-sm text-google-gray-600 bg-google-gray-100 px-3 py-1.5 rounded-full mt-2 w-fit">
                  <Folder className="w-4 h-4 mr-2" />
                  {currentPath}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <div className="flex shadow-sm rounded-md overflow-hidden border border-google-gray-200">
                <button className="flex items-center px-3 py-1.5 bg-google-gray-50 hover:bg-google-gray-100 transition-colors text-sm font-medium text-google-gray-700 outline-none">
                  <GitFork className="w-4 h-4 mr-2" />
                  Fork
                </button>
                <div className="flex items-center px-3 py-1.5 bg-white border-l border-google-gray-200 text-sm font-semibold text-google-gray-800">
                  {repoData?.forks_count?.toLocaleString() || 0}
                </div>
              </div>
              <div className="flex shadow-sm rounded-md overflow-hidden border border-google-gray-200">
                <button className="flex items-center px-3 py-1.5 bg-google-gray-50 hover:bg-google-gray-100 transition-colors text-sm font-medium text-google-gray-700 outline-none">
                  <Star className="w-4 h-4 mr-2" />
                  Star
                </button>
                <div className="flex items-center px-3 py-1.5 bg-white border-l border-google-gray-200 text-sm font-semibold text-google-gray-800">
                  {repoData?.stargazers_count?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button className="flex items-center px-3 py-1.5 bg-google-gray-50 border border-google-gray-200 rounded-md text-sm font-medium text-google-gray-800 hover:bg-google-gray-100 transition-colors">
                <GitBranch className="w-4 h-4 mr-2 text-google-gray-500" />
                {repoData?.default_branch || "main"}
                <ChevronDown className="w-4 h-4 ml-1 text-google-gray-500" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 relative">
              <button
                onClick={() => {
                  const el = document.getElementById("code-dropdown");
                  if (el) el.classList.toggle("hidden");
                }}
                className="flex items-center px-4 py-1.5 bg-google-blue-600 border border-google-blue-700 rounded-md text-sm font-medium text-white hover:bg-google-blue-700 transition-colors shadow-sm ml-1"
              >
                <Code2 className="w-4 h-4 mr-2" />
                Code
                <ChevronDown className="w-4 h-4 ml-1 opacity-80" />
              </button>
              <div
                id="code-dropdown"
                className="hidden absolute top-10 right-0 w-80 bg-white border border-google-gray-200 rounded-md shadow-lg z-50 p-4"
              >
                <h4 className="font-semibold text-sm mb-2 text-google-gray-800">
                  Clone
                </h4>
                <div>
                  <div className="text-xs font-semibold text-google-gray-600 mb-1">
                    HTTPS
                  </div>
                  <div className="flex items-center border border-google-gray-200 rounded-md overflow-hidden bg-google-gray-50 mb-3">
                    <input
                      type="text"
                      readOnly
                      value={
                        repoData?.clone_url ||
                        `https://github.com/${repoOwner}/${repoName}.git`
                      }
                      className="flex-1 bg-transparent text-xs p-2 outline-none text-google-gray-800"
                    />
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          repoData?.clone_url ||
                            `https://github.com/${repoOwner}/${repoName}.git`,
                        )
                      }
                      className="px-2 py-2 hover:bg-google-gray-200 transition-colors"
                    >
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
                  <button
                    className="shrink-0 flex"
                    onClick={() =>
                      commit?.author?.login &&
                      onProfileClick(commit.author.login)
                    }
                  >
                    <img
                      src={
                        commit?.author?.avatar_url ||
                        `https://github.com/${repoOwner}.png`
                      }
                      alt="Avatar"
                      className="w-6 h-6 rounded-full shrink-0 object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
                      }}
                    />
                  </button>
                  <button
                    onClick={() =>
                      commit?.author?.login &&
                      onProfileClick(commit.author.login)
                    }
                    className="font-semibold text-sm text-google-gray-800 shrink-0 hover:text-google-blue-600"
                  >
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
                  <span className="text-sm text-google-gray-500 w-20 truncate">
                    {commitDate}
                  </span>
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
                  <div className="border-b border-google-gray-200 bg-google-gray-50 px-4 py-2 flex justify-between items-center">
                    <button
                      onClick={() => {
                        const parts = currentPath.split("/");
                        parts.pop();
                        onNavigate(parts.join("/"));
                      }}
                      className="flex items-center text-sm font-medium text-google-gray-700 hover:text-google-blue-600 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      Go Back
                    </button>
                    {repoData?.html_url && (
                      <a
                        href={`${repoData.html_url}/blob/${repoData.default_branch || "main"}/${currentPath}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center text-xs font-semibold rounded-full border border-google-gray-200 text-google-blue-600 hover:bg-google-gray-100 bg-white px-3 py-1 transition-colors"
                      >
                        View on Origin
                      </a>
                    )}
                  </div>
                  {currentPath.toLowerCase().endsWith(".md") ? (
                    <MarkdownViewer content={fileContent} />
                  ) : currentPath.toLowerCase() === "license" ||
                    currentPath.toLowerCase() === "license.txt" ? (
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
                        const parts = currentPath.split("/");
                        parts.pop();
                        onNavigate(parts.join("/"));
                      }}
                      className="w-full flex items-center py-2.5 px-4 border-t border-google-gray-200 hover:bg-google-gray-50 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5 mr-3 shrink-0 text-google-gray-500" />
                      <span className="text-sm font-medium text-google-gray-800">
                        ..
                      </span>
                    </button>
                  )}
                  {contents.map((item) => (
                    <FileRow
                      key={item.path}
                      icon={item.type === "dir" ? Folder : FileText}
                      name={item.name}
                      isDir={item.type === "dir"}
                      onClick={() => onNavigate(item.path)}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          {!fileContent && !isLoading && readmeContent && (
            <div
              id="readme-section"
              className="mt-6 border border-google-gray-200 rounded-xl overflow-hidden bg-white shadow-sm scroll-mt-20"
            >
              <div className="px-4 py-3 border-b border-google-gray-200 bg-google-gray-50 flex items-center font-semibold text-sm text-google-gray-800">
                <BookOpen className="w-4 h-4 mr-2" />
                README.md
              </div>
              <MarkdownViewer content={readmeContent} />
            </div>
          )}
        </div>

        <RightSidebar
          repoData={repoData}
          releases={releases}
          repoOwner={repoOwner}
          repoName={repoName}
          apiUrl={apiUrl}
          onTabChange={onTabChange}
        />
      </div>
    </motion.main>
  );
};

const UserProfileView = ({
  username,
  onSelectRepo,
  apiUrl,
}: {
  username: string;
  onSelectRepo: (owner: string, repo: string) => void;
  apiUrl: string;
}) => {
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchJson(`${apiUrl}/users/${username}`)
      .then((data) => {
        setUser(data);
        return fetchJson(
          `${apiUrl}/users/${username}/repos?sort=updated&per_page=15`,
        );
      })
      .then((data) => {
        if (Array.isArray(data)) setRepos(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [username, apiUrl]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-google-gray-500 w-full mt-10">
        Loading profile...
      </div>
    );
  }

  if (!user || user.message === "Not Found") {
    return (
      <div className="p-8 text-center text-google-gray-500 w-full mt-10">
        User not found.
      </div>
    );
  }

  if (user.message) {
    return (
      <div className="p-8 text-center text-red-500 w-full mt-10">
        {user.message}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="flex-1 py-8 px-4 md:px-8 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-10 overflow-y-auto"
    >
      {/* Left Sidebar for User Details */}
      <div className="w-full md:w-80 shrink-0 flex flex-col">
        <div className="relative mb-6">
          <div className="w-full max-w-[280px] aspect-square rounded-full overflow-hidden border-4 border-white shadow-xl bg-white shrink-0">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-full h-full object-cover shrink-0"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-google-gray-900 tracking-tight">
          {user.name || user.login}
        </h1>
        <h2 className="text-xl text-google-gray-500 font-normal mb-5">
          {user.login}
        </h2>

        {user.bio && (
          <p className="text-google-gray-700 text-base mb-6 leading-relaxed bg-google-gray-50 p-4 rounded-xl border border-google-gray-100">
            {user.bio}
          </p>
        )}

        <div className="flex flex-col gap-3 text-sm text-google-gray-700 mb-6">
          <div className="flex items-center text-google-gray-800 font-medium">
            <Users className="w-[18px] h-[18px] mr-2 text-google-gray-500" />
            <span>
              <span className="font-bold text-google-gray-900">
                {user.followers}
              </span>{" "}
              followers
            </span>
            <span className="mx-2 text-google-gray-300">•</span>
            <span>
              <span className="font-bold text-google-gray-900">
                {user.following}
              </span>{" "}
              following
            </span>
          </div>

          {user.company && (
            <div className="flex items-center">
              <Building2 className="w-[18px] h-[18px] mr-2 text-google-gray-500" />
              <span className="truncate">{user.company}</span>
            </div>
          )}

          {user.location && (
            <div className="flex items-center">
              <MapPin className="w-[18px] h-[18px] mr-2 text-google-gray-500" />
              <span>{user.location}</span>
            </div>
          )}

          {user.email && (
            <div className="flex items-center">
              <Mail className="w-[18px] h-[18px] mr-2 text-google-gray-500" />
              <a
                href={`mailto:${user.email}`}
                className="hover:text-google-blue-600 hover:underline"
              >
                {user.email}
              </a>
            </div>
          )}

          {user.blog && (
            <div className="flex items-center">
              <Link2 className="w-[18px] h-[18px] mr-2 text-google-gray-500" />
              <a
                href={
                  user.blog.startsWith("http")
                    ? user.blog
                    : `https://${user.blog}`
                }
                target="_blank"
                rel="noreferrer"
                className="text-google-blue-600 hover:underline truncate"
              >
                {user.blog}
              </a>
            </div>
          )}
        </div>

        <a
          href={user.html_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-full py-2.5 bg-white hover:bg-google-gray-50 text-google-gray-800 font-semibold rounded-lg text-sm transition-all border border-google-gray-300 shadow-sm"
        >
          View on Origin
        </a>
      </div>

      {/* Main content for Repositories */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-google-gray-200">
          <h3 className="text-2xl font-bold text-google-gray-900 tracking-tight">
            Recent Repositories
          </h3>
          <span className="px-3 py-1 bg-google-gray-100 text-google-gray-700 text-sm font-semibold rounded-full">
            {repos.length}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {repos.map((r) => (
            <div
              key={r.id}
              className="group relative border border-google-gray-200 rounded-2xl p-5 hover:border-google-blue-300 hover:shadow-md bg-white transition-all duration-200 flex flex-col items-start text-left cursor-pointer overflow-hidden"
              onClick={() => onSelectRepo(r.owner.login, r.name)}
            >
              <div className="flex items-start justify-between w-full mb-3 gap-4">
                <button className="text-google-blue-700 font-semibold group-hover:text-google-blue-600 text-[17px] tracking-tight leading-tight truncate text-left w-full break-normal">
                  {r.name}
                </button>
                <span className="text-[11px] px-2.5 py-1 rounded-full border border-google-gray-200 text-google-gray-500 bg-white shadow-sm font-medium shrink-0 uppercase tracking-wider">
                  {r.private ? "Private" : "Public"}
                </span>
              </div>

              <p className="text-sm text-google-gray-600 mb-5 line-clamp-2 w-full leading-relaxed">
                {r.description || (
                  <span className="italic text-google-gray-400">
                    No description provided.
                  </span>
                )}
              </p>

              <div className="mt-auto flex flex-wrap items-center text-sm text-google-gray-600 gap-x-5 gap-y-2 w-full font-medium">
                {r.language && (
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-google-blue-500 mr-2 shadow-sm border border-black/10"></span>
                    {r.language}
                  </div>
                )}

                {r.stargazers_count > 0 && (
                  <div className="flex items-center hover:text-google-gray-900 transition-colors">
                    <Star className="w-[15px] h-[15px] mr-1.5 text-yellow-500 fill-current" />
                    {r.stargazers_count}
                  </div>
                )}

                {r.forks_count > 0 && (
                  <div className="flex items-center hover:text-google-gray-900 transition-colors">
                    <GitFork className="w-[15px] h-[15px] mr-1.5 text-google-gray-400" />
                    {r.forks_count}
                  </div>
                )}

                {r.updated_at && (
                  <div className="flex items-center text-google-gray-400 text-xs ml-auto font-normal">
                    Updated{" "}
                    {new Date(r.updated_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ActivityTab = ({
  repoOwner,
  repoName,
  apiUrl,
}: {
  repoOwner: string;
  repoName: string;
  apiUrl: string;
}) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}/events?per_page=30`)
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repoOwner, repoName, apiUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 py-6 px-4 md:px-8 max-w-5xl mx-auto w-full"
    >
      <h2 className="text-2xl font-bold text-google-gray-800 mb-6">
        Recent Activity
      </h2>
      <div className="bg-white border border-google-gray-200 rounded-xl overflow-hidden shadow-sm divide-y divide-google-gray-200">
        {loading ? (
          <div className="p-8 text-center text-google-gray-500">
            Loading activity...
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-google-gray-500">
            No recent activity found.
          </div>
        ) : (
          events.map((ev, i) => (
            <div
              key={ev.id || i}
              className="p-4 hover:bg-google-gray-50 transition-colors flex items-start gap-4"
            >
              <Activity className="w-5 h-5 text-google-gray-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] text-google-gray-800 mb-1 leading-snug">
                  <span className="font-semibold text-google-gray-900">
                    {ev.actor?.login || "Someone"}
                  </span>
                  <span>
                    {" "}
                    {ev.type === "PushEvent"
                      ? "pushed to"
                      : ev.type === "CreateEvent"
                        ? "created"
                        : ev.type === "IssuesEvent"
                          ? "interacted with an issue on"
                          : ev.type === "PullRequestEvent"
                            ? "interacted with a pull request on"
                            : "performed an action on"}{" "}
                  </span>
                  <span className="font-semibold text-google-gray-900">
                    {ev.repo?.name}
                  </span>
                </div>
                <div className="text-xs text-google-gray-500">
                  {new Date(ev.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const InsightsTab = ({
  repoOwner,
  repoName,
  apiUrl,
}: {
  repoOwner: string;
  repoName: string;
  apiUrl: string;
}) => {
  const [contributors, setContributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchJson(
      `${apiUrl}/repos/${repoOwner}/${repoName}/contributors?per_page=50`,
    )
      .then((data) => {
        setContributors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repoOwner, repoName, apiUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 py-6 px-4 md:px-8 max-w-5xl mx-auto w-full"
    >
      <h2 className="text-2xl font-bold text-google-gray-800 mb-6">
        Contributors Insights
      </h2>
      <div className="bg-white border border-google-gray-200 rounded-xl overflow-hidden shadow-sm divide-y divide-google-gray-200">
        {loading ? (
          <div className="p-8 text-center text-google-gray-500">
            Loading contributors...
          </div>
        ) : contributors.length === 0 ? (
          <div className="p-12 text-center text-google-gray-500">
            No contributors found.
          </div>
        ) : (
          contributors.map((user, i) => (
            <div
              key={user.id || i}
              className="p-4 hover:bg-google-gray-50 transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-10 h-10 rounded-full bg-google-gray-100 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-google-gray-100 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-google-gray-400" />
                  </div>
                )}
                <div>
                  <a
                    href={user.html_url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-semibold text-google-gray-800 hover:text-google-blue-600 cursor-pointer"
                  >
                    {user.login}
                  </a>
                </div>
              </div>
              <div className="text-sm font-medium text-google-gray-600 bg-google-gray-100 px-3 py-1 rounded-full">
                {user.contributions}{" "}
                {user.contributions === 1 ? "commit" : "commits"}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [viewMode, setViewMode] = useState<"home" | "repo" | "user">("home");
  const [profileUsername, setProfileUsername] = useState("");

  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [activeTab, setActiveTab] = useState("code");

  const [historyStack, setHistoryStack] = useState<any[]>([]);

  const pushHistory = () => {
    setHistoryStack((prev) => [
      ...prev,
      {
        viewMode,
        repoOwner,
        repoName,
        profileUsername,
        currentPath,
        activeTab,
      },
    ]);
  };

  const goBackHistory = () => {
    setHistoryStack((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setViewMode(last.viewMode);
      setRepoOwner(last.repoOwner);
      setRepoName(last.repoName);
      setProfileUsername(last.profileUsername);
      setCurrentPath(last.currentPath);
      setActiveTab(last.activeTab);
      return prev.slice(0, prev.length - 1);
    });
  };

  const [apiUrl, setApiUrl] = useState("https://api.github.com");
  const [repoData, setRepoData] = useState<any>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [commit, setCommit] = useState<any>(null);
  const [releases, setReleases] = useState<any[]>([]);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRepoData = () => {
    setRepoData(null);
    setCommit(null);
    setReleases([]);

    fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}`)
      .then((data) => {
        if (data.message && data.message.includes("Failed to fetch")) {
          setRepoData({ description: "Repository not found or API error." });
        } else {
          setRepoData(data);
        }
      })
      .catch(() =>
        setRepoData({ description: "Could not load repository data." }),
      );

    fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}/commits?per_page=1`)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCommit(data[0]);
        } else {
          setCommit({
            commit: {
              message:
                "No commits found or endpoint unsupported on this instance.",
            },
          });
        }
      })
      .catch(() =>
        setCommit({ commit: { message: "Error loading latest commit." } }),
      );

    fetchJson(`${apiUrl}/repos/${repoOwner}/${repoName}/releases`)
      .then((data) => {
        if (Array.isArray(data)) {
          setReleases(data);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchRepoData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoOwner, repoName, apiUrl]);

  useEffect(() => {
    setIsLoading(true);
    setFileContent(null);
    setReadmeContent(null);
    const url = currentPath
      ? `${apiUrl}/repos/${repoOwner}/${repoName}/contents/${currentPath}`
      : `${apiUrl}/repos/${repoOwner}/${repoName}/contents`;

    fetchJson(url)
      .then((data) => {
        if (Array.isArray(data)) {
          const dirs = data.filter((d) => d.type === "dir");
          const files = data.filter((d) => d.type === "file");
          setContents([...dirs, ...files]);
          setFileContent(null);

          const readmeFile = data.find(
            (d: any) => d.name.toLowerCase() === "readme.md",
          );
          if (readmeFile && readmeFile.download_url) {
            const proxiedReadmeUrl = `/api/proxy?url=${encodeURIComponent(readmeFile.download_url)}`;
            fetch(proxiedReadmeUrl)
              .then((r) =>
                r.ok ? r.text() : Promise.reject(new Error("Bad text status")),
              )
              .then((text) => setReadmeContent(text))
              .catch(() => setReadmeContent(null));
          } else {
            setReadmeContent(null);
          }
        } else if (data && data.type === "file") {
          // Decode content
          if (data.content && data.encoding === "base64") {
            try {
              const text = atob(data.content);
              setFileContent(text);
            } catch (e) {
              setFileContent("Error decoding file contents.");
            }
          } else {
            setFileContent("Cannot display file contents natively.");
          }
        } else if (data && data.message) {
          setFileContent(
            `API Error: ${data.message}\n\nPlease check your instance URL or API rate limits.`,
          );
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setContents([]);
        setFileContent("Error loading contents.");
        setIsLoading(false);
      });
  }, [repoOwner, repoName, currentPath, apiUrl]);

  const handleSearch = (val: string) => {
    pushHistory();
    let owner = val;
    let repo = "";
    let currApiUrl = "https://api.github.com";
    let searchVal = val.trim();

    try {
      const match = searchVal.match(
        /^(gitea|forgejo|codeberg|gitlab|github):\s*(.+)$/i,
      );

      if (match) {
        const provider = match[1].toLowerCase();
        const rest = match[2];
        const isHttp = rest.startsWith("http");

        if (isHttp) {
          const url = new URL(rest);
          const parts = url.pathname.split("/").filter(Boolean);
          owner = parts[0] || owner;
          repo = parts[1] || repo;
          currApiUrl =
            provider === "github"
              ? "https://api.github.com"
              : `${url.origin}/api/v1`;
        } else {
          const parts = rest.split("/").filter(Boolean);
          owner = parts[0] || owner;
          repo = parts[1] || repo;
          if (provider === "codeberg" || provider === "forgejo")
            currApiUrl = "https://codeberg.org/api/v1";
          else if (provider === "gitea")
            currApiUrl = "https://gitea.com/api/v1";
          else if (provider === "gitlab")
            currApiUrl = "https://gitlab.com/api/v4";
        }
      } else if (searchVal.startsWith("http")) {
        const url = new URL(searchVal);
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts.length >= 2) {
          owner = parts[0];
          repo = parts[1];
        } else if (parts.length === 1) {
          owner = parts[0];
        }

        if (url.hostname === "github.com") {
          currApiUrl = "https://api.github.com";
        } else if (url.hostname === "gitlab.com") {
          currApiUrl = "https://gitlab.com/api/v4";
        } else {
          currApiUrl = `${url.origin}/api/v1`;
        }
      } else {
        const parts = searchVal.split("/").filter(Boolean);
        if (parts.length >= 2) {
          owner = parts[0];
          repo = parts[1];
        } else if (parts.length === 1) {
          owner = parts[0];
        }
      }
    } catch (e) {
      const parts = searchVal.split("/").filter(Boolean);
      owner = parts[0] || owner;
      repo = parts[1] || repo;
    }

    setApiUrl(currApiUrl);

    if (owner && repo) {
      setRepoOwner(owner);
      setRepoName(repo);
      setCurrentPath("");
      setActiveTab("code");
      setViewMode("repo");
    } else if (owner && !repo) {
      setProfileUsername(owner);
      setViewMode("user");
    }
  };

  return (
    <div className="min-h-screen bg-white text-google-gray-800 font-sans antialiased text-left selection:bg-google-blue-100 selection:text-google-blue-800 flex flex-col items-stretch">
      <TopNav
        onSearch={handleSearch}
        onLogoClick={() => {
          pushHistory();
          setViewMode("home");
          setRepoOwner("");
          setRepoName("");
          setProfileUsername("");
          setCurrentPath("");
        }}
        repoOwner={repoOwner}
        onAvatarClick={() => {
          pushHistory();
          setProfileUsername(repoOwner);
          setViewMode("user");
        }}
        viewMode={viewMode}
        canGoBack={historyStack.length > 0}
        onGoBack={goBackHistory}
      />
      <div className="flex flex-1 flex-col md:flex-row h-auto min-h-[calc(100vh-64px)] overflow-hidden items-start align-top">
        {viewMode === "repo" && (
          <>
            <SideNav
              repoData={repoData}
              activeTab={activeTab}
              onTabChange={(tab: string) => {
                if (tab === "code") setCurrentPath("");
                setActiveTab(tab);
              }}
            />
            <MobileNav
              repoData={repoData}
              activeTab={activeTab}
              onTabChange={(tab: string) => {
                if (tab === "code") setCurrentPath("");
                setActiveTab(tab);
              }}
            />
          </>
        )}
        <div className="flex-1 overflow-x-hidden overflow-y-auto w-full self-stretch align-top flex flex-col relative">
          <AnimatePresence mode="wait">
            {viewMode === "home" ? (
              <LandingPage key="home" onSearch={handleSearch} />
            ) : viewMode === "user" ? (
              <UserProfileView
                key="user-profile"
                username={profileUsername}
                apiUrl={apiUrl}
                onSelectRepo={(o, r) => {
                  pushHistory();
                  setRepoOwner(o);
                  setRepoName(r);
                  setCurrentPath("");
                  setActiveTab("code");
                  setViewMode("repo");
                }}
              />
            ) : activeTab === "code" ? (
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
                  pushHistory();
                  setProfileUsername(uname);
                  setViewMode("user");
                }}
                onTabChange={setActiveTab}
              />
            ) : activeTab === "issues" ? (
              <IssuesTab
                key="issues"
                repoOwner={repoOwner}
                repoName={repoName}
                apiUrl={apiUrl}
              />
            ) : activeTab === "pulls" ? (
              <PullsTab
                key="pulls"
                repoOwner={repoOwner}
                repoName={repoName}
                apiUrl={apiUrl}
              />
            ) : activeTab === "activity" ? (
              <ActivityTab
                key="activity"
                repoOwner={repoOwner}
                repoName={repoName}
                apiUrl={apiUrl}
              />
            ) : activeTab === "actions" ? (
              <GenericListTab
                key="actions"
                repoOwner={repoOwner}
                repoName={repoName}
                apiUrl={apiUrl}
                endpoint="actions/runs"
                title="Actions"
                icon={PlayCircle}
                emptyText="No workflow runs found."
              />
            ) : activeTab === "projects" ? (
              <GenericListTab
                key="projects"
                repoOwner={repoOwner}
                repoName={repoName}
                apiUrl={apiUrl}
                endpoint="projects"
                title="Projects"
                icon={LayoutGrid}
                emptyText="No projects found."
              />
            ) : activeTab === "discussions" ? (
              <GenericListTab
                key="discussions"
                repoOwner={repoOwner}
                repoName={repoName}
                apiUrl={apiUrl}
                endpoint="discussions"
                title="Discussions"
                icon={MessageSquare}
                emptyText="No discussions found."
              />
            ) : activeTab === "security" ? (
              <GenericListTab
                key="security"
                repoOwner={repoOwner}
                repoName={repoName}
                apiUrl={apiUrl}
                endpoint="dependabot/alerts"
                title="Security Alerts"
                icon={Shield}
                emptyText="No security alerts."
              />
            ) : activeTab === "insights" ? (
              <InsightsTab
                key="insights"
                repoOwner={repoOwner}
                repoName={repoName}
                apiUrl={apiUrl}
              />
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
                <h2 className="text-2xl font-bold text-google-gray-800 mb-3 capitalize">
                  {activeTab}
                </h2>
                <p className="text-google-gray-600 max-w-md">
                  This view is not fully implemented in this custom instance
                  yet.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <footer className="w-full mt-auto py-6 px-4 md:px-8 border-t border-google-gray-200 bg-google-gray-50 text-center flex flex-col items-center justify-center gap-2">
            <p className="text-google-gray-500 text-sm">
              <strong className="text-google-gray-700">Disclaimer:</strong> This
              is a custom UI instance connecting to public APIs. It is not
              affiliated with GitHub, Gitea, or Google.
            </p>
            <p className="text-google-gray-500 text-sm flex items-center">
              Made with <span className="mx-1 text-google-red-500">❤️</span> by{" "}
              <a
                href="https://github.com/m4rcel-lol"
                target="_blank"
                rel="noreferrer"
                className="ml-1 text-google-blue-600 hover:underline font-medium"
              >
                m4rcel-lol
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
