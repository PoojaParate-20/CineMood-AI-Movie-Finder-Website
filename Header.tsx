import { Bookmark, Clapperboard } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenWatchlist: () => void;
}

export default function Header({ savedCount, onOpenWatchlist }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-stone-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a href="/" className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-950 transition group-hover:rotate-[-6deg]">
            <Clapperboard className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl text-stone-50">CineMood</span>
            <span className="hidden text-xs text-stone-400 sm:block">AI-Powered Movie Finder by Vibe &amp; Emotion</span>
          </span>
        </a>

        <button
          type="button"
          onClick={onOpenWatchlist}
          className="inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-100 transition hover:border-amber-400 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <Bookmark className="h-4 w-4" aria-hidden="true" />
          Watchlist
          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-stone-950 tabular-nums">
            {savedCount}
          </span>
        </button>
      </div>
    </header>
  );
}
