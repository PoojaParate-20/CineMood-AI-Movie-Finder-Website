import { useEffect, useRef } from 'react';
import { AlertCircle, Film, Loader2, Trash2, Tv, X } from 'lucide-react';
import type { WatchlistItem } from '@/lib/watchlist';

interface WatchlistPanelProps {
  open: boolean;
  items: WatchlistItem[];
  loading: boolean;
  loadError: string | null;
  actionError: string | null;
  isPending: (key: string) => boolean;
  onRemove: (id: string) => void;
  onRetry: () => void;
  onClose: () => void;
}

export default function WatchlistPanel({
  open,
  items,
  loading,
  loadError,
  actionError,
  isPending,
  onRemove,
  onRetry,
  onClose,
}: WatchlistPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="watchlist-title"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-stone-800 bg-stone-950 shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-stone-800 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-400">Your list</p>
            <h2 id="watchlist-title" className="font-display text-2xl text-stone-50">
              Watchlist
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close watchlist"
            className="rounded-full p-2 text-stone-400 transition hover:bg-stone-800 hover:text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {actionError && (
            <p role="alert" className="mb-4 flex items-start gap-2 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {actionError}
            </p>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading your list...
            </div>
          )}

          {!loading && loadError && (
            <div role="alert" className="rounded-xl bg-rose-500/10 p-4 text-sm text-rose-300">
              <p>{loadError}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 font-semibold text-rose-200 underline underline-offset-4 hover:text-white"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !loadError && items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-stone-700 p-8 text-center">
              <p className="font-display text-xl text-stone-200">Nothing saved yet</p>
              <p className="mt-2 text-sm text-stone-400">
                Tap "Save to watchlist" on any pick and it will appear here.
              </p>
            </div>
          )}

          {!loading && !loadError && items.length > 0 && (
            <ul className="space-y-3">
              {items.map((item) => {
                const KindIcon = item.kind === 'tv' ? Tv : Film;
                const removing = isPending(`id:${item.id}`);
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl border border-stone-800 bg-stone-900/70 p-4 transition hover:border-stone-700"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-800 text-amber-300">
                      <KindIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-stone-100">{item.title}</p>
                      <p className="text-sm text-stone-400">
                        {item.kind === 'tv' ? 'TV Show' : 'Movie'} · {item.year}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      disabled={removing}
                      aria-label={`Remove ${item.title} from watchlist`}
                      className="rounded-full p-2 text-stone-500 transition hover:bg-rose-500/15 hover:text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50"
                    >
                      {removing ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
