import { useCallback, useState } from 'react';
import { Dices, Film } from 'lucide-react';
import Header from '@/components/Header';
import MoodPicker from '@/components/MoodPicker';
import TitleCard from '@/components/TitleCard';
import WatchlistPanel from '@/components/WatchlistPanel';
import { TITLES } from '@/data/titles';
import {
  MOOD_OPTIONS,
  WEATHER_OPTIONS,
  moodLabel,
  recommendTitles,
  weatherLabel,
  type KindFilter,
  type Mood,
  type Weather,
} from '@/lib/cinemood';
import { useWatchlist } from '@/hooks/useWatchlist';

function pickRandom<T>(options: readonly T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

export default function App() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [kind, setKind] = useState<KindFilter>('all');
  const [panelOpen, setPanelOpen] = useState(false);
  const watchlist = useWatchlist();

  const closePanel = useCallback(() => setPanelOpen(false), []);

  const surpriseMe = () => {
    setMood(pickRandom(MOOD_OPTIONS).value);
    setWeather(pickRandom(WEATHER_OPTIONS).value);
  };

  const results = mood && weather ? recommendTitles(TITLES, mood, weather, kind) : [];

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-200 antialiased">
      <Header savedCount={watchlist.items.length} onOpenWatchlist={() => setPanelOpen(true)} />

      <main>
        <section className="relative overflow-hidden border-b border-stone-800/80">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(60% 80% at 15% 0%, rgba(251,191,36,0.16), transparent 60%), radial-gradient(50% 60% at 90% 20%, rgba(56,189,248,0.12), transparent 60%)',
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
            <p className="animate-fade-up text-sm font-medium uppercase tracking-[0.2em] text-amber-400">
              Movies and shows for the moment you're in
            </p>
            <h1 className="animate-fade-up mt-4 max-w-3xl font-display text-4xl leading-[1.1] text-stone-50 sm:text-6xl">
              Tell us how you feel and what the sky looks like. We'll find tonight's watch.
            </h1>
            <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={surpriseMe}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-stone-950 transition hover:-translate-y-0.5 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
              >
                <Dices className="h-4 w-4" aria-hidden="true" />
                Surprise me
              </button>
              <span className="text-sm text-stone-400">or choose below</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <MoodPicker
            mood={mood}
            weather={weather}
            kind={kind}
            onMoodChange={setMood}
            onWeatherChange={setWeather}
            onKindChange={setKind}
          />
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8" aria-live="polite">
          {mood && weather ? (
            <>
              <div className="mb-8 flex flex-col gap-2 border-t border-stone-800 pt-12 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-400">Your picks</p>
                  <h2 className="mt-1 font-display text-3xl text-stone-50">
                    {results.length > 0
                      ? `${results.length} ${results.length === 1 ? 'match' : 'matches'} for a ${moodLabel(mood).toLowerCase()}, ${weatherLabel(weather).toLowerCase()} day`
                      : 'No matches for that combination'}
                  </h2>
                </div>
                <p className="text-sm text-stone-400">Best fits come first</p>
              </div>

              {results.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((item, index) => {
                    const key = `${item.kind}:${item.title}`;
                    return (
                      <TitleCard
                        key={item.id}
                        item={item}
                        mood={mood}
                        weather={weather}
                        index={index}
                        saved={watchlist.isSaved(item.title, item.kind)}
                        busy={watchlist.isPending(key)}
                        onToggleSaved={() =>
                          watchlist.toggle({ title: item.title, kind: item.kind, year: item.year })
                        }
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-700 p-10 text-center">
                  <Film className="mx-auto h-8 w-8 text-stone-500" aria-hidden="true" />
                  <p className="mt-4 font-display text-xl text-stone-200">Nothing fits that combination yet</p>
                  <p className="mt-2 text-sm text-stone-400">Try another weather or switch the filter to Everything.</p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-700 p-10 text-center">
              <p className="font-display text-xl text-stone-200">Choose a mood and the weather to see your picks</p>
              <p className="mt-2 text-sm text-stone-400">Or tap "Surprise me" for a random combination.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-stone-800 px-5 py-8 text-center text-sm text-stone-500 sm:px-8">
        CineMood. Your watchlist is saved to this browser only.
      </footer>

      <WatchlistPanel
        open={panelOpen}
        items={watchlist.items}
        loading={watchlist.loading}
        loadError={watchlist.loadError}
        actionError={watchlist.actionError}
        isPending={watchlist.isPending}
        onRemove={watchlist.remove}
        onRetry={watchlist.retry}
        onClose={closePanel}
      />
    </div>
  );
}
