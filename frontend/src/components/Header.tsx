export function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-5 py-4 max-w-screen-xl mx-auto w-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/40">
          <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm1 11H9v-2h2v2zm0-4H9V7h2v2z" />
          </svg>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">CryptoSwap</span>
      </div>

      {/* Nav tabs */}
      <nav className="flex items-center gap-0.5 bg-bg-secondary rounded-xl p-1 border border-white/5">
        <button className="px-4 py-1.5 rounded-lg bg-bg-card text-white text-sm font-medium shadow">
          Swap
        </button>
        <button className="px-4 py-1.5 rounded-lg text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors">
          History
        </button>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <a
          href="https://simpleswap.io"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:block text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Powered by SimpleSwap
        </a>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" title="Live" />
      </div>
    </header>
  );
}
