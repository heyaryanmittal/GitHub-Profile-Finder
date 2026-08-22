import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

/* ===== Language color map ===== */
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555', 'C#': '#178600',
  Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516', PHP: '#4F5D95',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', HTML: '#e34c26',
  CSS: '#563d7c', Shell: '#89e051', Vue: '#41b883', Jupyter: '#DA5B0B',
};

/* ===== Debounce hook ===== */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

/* ===== Format numbers ===== */
function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n;
}

/* ===== Time ago ===== */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/* ===== SVG Icons ===== */
const Icons = {
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Fork: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" />
      <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" /><path d="M12 12v3" />
    </svg>
  ),
  Repo: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  ),
  Location: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Link: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  Users: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ArrowUpRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7h10v10" /><path d="M7 17 17 7" />
    </svg>
  ),
  Company: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" />
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  ),
  Spinner: () => (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
  GitHub: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
};

/* ===== Stat Pill Component ===== */
function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass transition-all duration-300 hover:scale-105 cursor-default group"
      style={{ '--hover-color': color }}>
      <span className="transition-colors duration-300 group-hover:text-[var(--hover-color)]" style={{ color }}>
        <Icon />
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white leading-tight">{formatCount(value)}</span>
        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">{label}</span>
      </div>
    </div>
  );
}

/* ===== Repo Card Component ===== */
function RepoCard({ repo, index }) {
  const langColor = LANG_COLORS[repo.language] || '#8b8b8b';

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col p-5 rounded-2xl glass transition-all duration-300 hover:bg-[rgba(30,30,42,0.8)] hover:border-[rgba(139,92,246,0.3)] hover:-translate-y-1.5 hover:shadow-[0_8px_40px_rgba(139,92,246,0.12)] opacity-0 animate-scale-in cursor-pointer overflow-hidden"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.6)}s`, animationFillMode: 'forwards' }}
      id={`repo-card-${repo.id}`}
    >
      {/* Hover shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(139,92,246,0.04)] to-transparent animate-shimmer" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Icons.Repo />
          </span>
          <h4 className="text-[15px] font-semibold text-purple-300 group-hover:text-purple-200 truncate transition-colors" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {repo.name}
          </h4>
        </div>
        <span className="flex-shrink-0 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border border-gray-700/50 text-gray-500 group-hover:text-gray-400 transition-colors">
          {repo.visibility}
        </span>
      </div>

      {/* Description */}
      <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1 relative z-10 group-hover:text-gray-400 transition-colors">
        {repo.description || 'No description provided.'}
      </p>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 pt-3 border-t border-white/[0.04] relative z-10">
        {repo.language && (
          <span className="flex items-center gap-1.5 group-hover:text-gray-400 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: langColor }} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1 text-amber-600 group-hover:text-amber-400 transition-colors">
            <Icons.Star /> {formatCount(repo.stargazers_count)}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1 group-hover:text-gray-400 transition-colors">
            <Icons.Fork /> {formatCount(repo.forks_count)}
          </span>
        )}
        <span className="ml-auto group-hover:text-gray-400 transition-colors">
          {timeAgo(repo.updated_at)}
        </span>
      </div>

      {/* Arrow indicator on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 text-purple-400">
        <Icons.ArrowUpRight />
      </div>
    </a>
  );
}

/* ===== Profile Card Component ===== */
function ProfileCard({ user }) {
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'short', year: 'numeric',
  });

  return (
    <div className="w-full rounded-3xl p-8 sm:p-10 opacity-0 animate-slide-up overflow-hidden relative border border-purple-500/30 bg-[#0f1117]" style={{ animationFillMode: 'forwards', boxShadow: '0 0 40px rgba(139, 92, 246, 0.08), inset 0 1px 0 rgba(139, 92, 246, 0.1)' }} id="profile-card">

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

        {/* Left column: Avatar + Social icons */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0">
          {/* Avatar with purple ring */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-400 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={user.avatar_url}
              alt={`${user.login} avatar`}
              className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-[3px] border-[#0f1117] shadow-2xl"
              id="profile-avatar"
            />
          </div>

          {/* Social icon buttons */}
          <div className="flex items-center gap-2">
            {user.blog && (
              <a
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1a1b26] border border-gray-700/60 flex items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all duration-300"
                title="Website"
              >
                <Icons.Link />
              </a>
            )}
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#1a1b26] border border-gray-700/60 flex items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all duration-300"
              title="GitHub Profile"
            >
              <Icons.GitHub size={16} />
            </a>
          </div>
        </div>

        {/* Right column: Info */}
        <div className="flex-1 text-center md:text-left min-w-0">
          {/* Name — large, bold, uppercase */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wide leading-tight" id="profile-name">
            {user.name || user.login}
          </h2>

          {/* Username */}
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-base sm:text-lg text-purple-400 hover:text-purple-300 transition-colors mt-1 font-medium"
            id="profile-link"
          >
            @{user.login}
          </a>

          {/* Bio */}
          {user.bio && (
            <p className="text-base text-gray-400 mt-4 leading-relaxed max-w-xl" id="profile-bio">
              👋 {user.bio}
            </p>
          )}

          {/* Location & Joined pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-5">
            {user.location && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-700/60 bg-transparent text-sm text-gray-400">
                <span className="text-red-400">📍</span> {user.location}
              </span>
            )}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-700/60 bg-transparent text-sm text-gray-400">
              <span className="text-blue-400">📅</span> Joined {joinDate}
            </span>
            {user.company && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-700/60 bg-transparent text-sm text-gray-400">
                <span className="text-purple-400">🏢</span> {user.company}
              </span>
            )}
          </div>

          {/* Stats: 3 large boxes */}
          <div className="flex flex-wrap items-stretch justify-center md:justify-start gap-4 mt-7">
            {/* Followers */}
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-700/60 bg-[#0f1117] min-w-[140px] hover:border-purple-500/40 transition-colors duration-300">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Icons.Users />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight">{formatCount(user.followers)}</span>
                <span className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Followers</span>
              </div>
            </div>

            {/* Following */}
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-700/60 bg-[#0f1117] min-w-[140px] hover:border-purple-500/40 transition-colors duration-300">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight">{formatCount(user.following)}</span>
                <span className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Following</span>
              </div>
            </div>

            {/* Public Repos */}
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-700/60 bg-[#0f1117] min-w-[140px] hover:border-purple-500/40 transition-colors duration-300">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Icons.Repo />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight">{formatCount(user.public_repos)}</span>
                <span className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Public Repos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Loading Skeleton ===== */
function Skeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      {/* Profile skeleton */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-3 w-full">
            <div className="h-6 w-48 bg-white/5 rounded-lg animate-pulse mx-auto sm:mx-0" />
            <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse mx-auto sm:mx-0" />
            <div className="h-4 w-72 bg-white/5 rounded-lg animate-pulse mx-auto sm:mx-0 mt-4" />
            <div className="flex gap-3 mt-5 justify-center sm:justify-start">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 w-24 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Repo grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-5 space-y-3">
            <div className="h-5 w-3/4 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-4 w-full bg-white/5 rounded-lg animate-pulse" />
            <div className="h-4 w-2/3 bg-white/5 rounded-lg animate-pulse" />
            <div className="flex gap-3 pt-3 border-t border-white/[0.04]">
              <div className="h-3 w-16 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-3 w-10 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Main App ===== */
function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const debouncedUsername = useDebounce(username.trim(), 600);

  /* ===== Fetch on debounced username change ===== */
  const fetchUserData = useCallback(async (name) => {
    if (!name) {
      setUserData(null);
      setRepos([]);
      setError('');
      return;
    }

    // Abort previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError('');
    setUserData(null);
    setRepos([]);

    try {
      // Build auth headers if token is available (5,000 req/hr vs 60 req/hr)
      const headers = {};
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const userRes = await fetch(`https://api.github.com/users/${name}`, {
        headers,
        signal: controller.signal,
      });
      if (!userRes.ok) {
        if (userRes.status === 404) throw new Error('User not found');
        if (userRes.status === 403) throw new Error('API rate limit exceeded. Add a GitHub token to your .env file.');
        throw new Error('Error fetching user');
      }
      const user = await userRes.json();
      setUserData(user);

      // Fetch ALL repos with pagination (GitHub max 100 per page)
      let allRepos = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const reposRes = await fetch(
          `https://api.github.com/users/${name}/repos?sort=updated&per_page=100&page=${page}`,
          { headers, signal: controller.signal }
        );
        if (!reposRes.ok) {
          if (reposRes.status === 403) throw new Error('API rate limit exceeded while fetching repositories.');
          throw new Error('Error fetching repositories');
        }
        const reposData = await reposRes.json();
        allRepos = [...allRepos, ...reposData];

        // If we got fewer than 100, we've reached the last page
        if (reposData.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      }

      setRepos(allRepos);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData(debouncedUsername);
  }, [debouncedUsername, fetchUserData]);

  /* ===== Focus input on mount ===== */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const clearInput = () => {
    setUsername('');
    setUserData(null);
    setRepos([]);
    setError('');
    inputRef.current?.focus();
  };

  const hasResults = userData && !loading;
  const showLanding = !hasResults && !loading && !error;

  return (
    <div className="noise-overlay min-h-screen relative">
      {/* Background mesh */}
      <div className="bg-mesh" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ===== Top Section: Heading + Search (always visible) ===== */}
        <div className={`w-full flex flex-col items-center transition-all duration-500 ease-out ${
          hasResults || loading ? 'pt-8 pb-5' : 'pt-[12vh] pb-10'
        }`}>
          {/* Heading */}
          <h1 className={`text-center leading-[1.15] transition-all duration-500 ${
            hasResults || loading
              ? 'text-2xl sm:text-3xl mb-5'
              : 'text-5xl sm:text-6xl md:text-7xl mb-10'
          }`} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }} id="main-heading">
            <span className="text-white">Find any </span>
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 bg-clip-text text-transparent italic" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}>
              GitHub
            </span>
            <span className="text-white"> profile</span>
          </h1>

          {/* Search Bar */}
          <div className={`w-full transition-all duration-500 ${
            hasResults || loading ? 'max-w-xl' : 'max-w-2xl'
          } px-4`} id="search-container">
            <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-300 ${
              username
                ? 'border-purple-500/40 bg-[#111827] shadow-[0_0_40px_rgba(139,92,246,0.12)]'
                : 'border-gray-700/50 bg-[#111827] hover:border-gray-600/70'
            }`}>
              <span className="absolute left-5 text-gray-500 pointer-events-none">
                {loading ? <Icons.Spinner /> : <Icons.Search />}
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent pl-14 pr-32 py-5 text-lg text-white placeholder-gray-600 focus:outline-none transition-colors"
                id="search-input"
                autoComplete="off"
                spellCheck="false"
              />
              {username && (
                <button
                  onClick={clearInput}
                  className="absolute right-28 text-gray-600 hover:text-gray-300 transition-colors p-1"
                  aria-label="Clear search"
                  id="clear-search"
                >
                  <Icons.X />
                </button>
              )}
              {/* Search button */}
              <button
                className="absolute right-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-base font-bold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95"
                onClick={() => fetchUserData(username.trim())}
                id="search-button"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* ===== Landing State: Octocat + Message ===== */}
        {showLanding && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-8 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }} id="landing">
            {/* GitHub Octocat */}
            <div className="text-gray-700/50 mb-6">
              <Icons.GitHub size={120} />
            </div>
            <p className="text-gray-500 text-base sm:text-lg font-medium">
              Start searching to find users
            </p>
          </div>
        )}

        {/* ===== Loading State ===== */}
        {loading && <Skeleton />}

        {/* ===== Error State ===== */}
        {error && !loading && (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center opacity-0 animate-scale-in max-w-sm" style={{ animationFillMode: 'forwards' }} id="error-state">
              <div className="text-5xl mb-4">😕</div>
              <h3 className="text-lg font-semibold text-white mb-2">Oops!</h3>
              <p className="text-gray-500 text-sm">{error}</p>
              <button
                onClick={clearInput}
                className="mt-6 px-5 py-2 text-sm font-medium text-purple-400 border border-purple-500/30 rounded-full hover:bg-purple-500/10 transition-all"
              >
                Try another search
              </button>
            </div>
          </div>
        )}

        {/* ===== Results ===== */}
        {hasResults && (
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16" id="results">
            {/* Profile */}
            <ProfileCard user={userData} />

            {/* Repos Section */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-3 text-lg font-semibold text-white opacity-0 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                  <span className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
                  Repositories
                  <span className="text-sm font-normal text-gray-600 ml-1">({repos.length})</span>
                </h3>
              </div>

              {repos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="repo-grid">
                  {repos.map((repo, index) => (
                    <RepoCard key={repo.id} repo={repo} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 glass rounded-2xl opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-gray-500 text-sm">No repositories found for this user.</p>
                </div>
              )}
            </div>
          </main>
        )}

        {/* ===== Footer ===== */}
        <footer className="relative z-10 py-6 text-center text-xs text-gray-700 border-t border-white/[0.03]">
          Built with React • Data from GitHub API
        </footer>
      </div>
    </div>
  );
}

export default App;
