import { Bookmark, BookmarkCheck, Film, Loader2, Tv } from 'lucide-react';
import {
  moodLabel,
  weatherLabel,
  type Mood,
  type Recommendation,
  type Weather,
} from '@/lib/cinemood';

interface TitleCardProps {
  item: Recommendation;
  mood: Mood;
  weather: Weather;
  saved: boolean;
  busy: boolean;
  index: number;
  onToggleSaved: () => void;
}

export default function TitleCard({
  item,
  mood,
  weather,
  saved,
  busy,
  index,
  onToggleSaved,
}: TitleCardProps) {
  const isTv = item.kind === 'tv';
  const KindIcon = isTv ? Tv : Film;

  return (
    <article
      className="animate-fade-up flex flex-col overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/70 transition duration-300 hover:-translate-y-1 hover:border-stone-600 hover:shadow-2xl hover:shadow-black/40"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div
        className={`relative flex h-28 flex-col justify-between p-4 ${
          isTv
            ? 'bg-gradient-to-br from-sky-900 via-stone-900 to-stone-950'
            : 'bg-gradient-to-br from-amber-900/80 via-stone-900 to-stone-950'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-950/60 px-2.5 py-1 text-xs font-medium text-stone-200">
            <KindIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {isTv ? 'TV Show' : 'Movie'}
          </span>
          <span className="font-display text-lg text-stone-300/80">{item.year}</span>
        </div>
        <p className="text-xs text-stone-400">{item.genres.join(' · ')}</p>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-xl leading-tight text-stone-50">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-400">{item.blurb}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          {item.matchesMood && (
            <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-medium text-amber-300">
              Fits {moodLabel(mood).toLowerCase()}
            </span>
          )}
          {item.matchesWeather && (
            <span className="rounded-full bg-sky-400/15 px-2.5 py-1 text-xs font-medium text-sky-300">
              Fits {weatherLabel(weather).toLowerCase()} skies
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleSaved}
          disabled={busy}
          aria-pressed={saved}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60 ${
            saved
              ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
              : 'bg-stone-100 text-stone-950 hover:bg-white'
          }`}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : saved ? (
            <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Bookmark className="h-4 w-4" aria-hidden="true" />
          )}
          {saved ? 'Saved to watchlist' : 'Save to watchlist'}
        </button>
      </div>
    </article>
  );
}
