import {
  Activity,
  Cloud,
  CloudLightning,
  CloudRain,
  Coffee,
  Heart,
  Hourglass,
  Moon,
  Smile,
  Snowflake,
  Sun,
  Telescope,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  KIND_OPTIONS,
  MOOD_OPTIONS,
  WEATHER_OPTIONS,
  type KindFilter,
  type Mood,
  type Weather,
} from '@/lib/cinemood';

const MOOD_ICONS: Record<Mood, LucideIcon> = {
  happy: Smile,
  melancholy: Moon,
  adrenaline: Zap,
  romantic: Heart,
  cozy: Coffee,
  anxious: Activity,
  curious: Telescope,
  nostalgic: Hourglass,
};

const WEATHER_ICONS: Record<Weather, LucideIcon> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
  snowy: Snowflake,
};

interface MoodPickerProps {
  mood: Mood | null;
  weather: Weather | null;
  kind: KindFilter;
  onMoodChange: (mood: Mood) => void;
  onWeatherChange: (weather: Weather) => void;
  onKindChange: (kind: KindFilter) => void;
}

export default function MoodPicker({
  mood,
  weather,
  kind,
  onMoodChange,
  onWeatherChange,
  onKindChange,
}: MoodPickerProps) {
  return (
    <div className="space-y-10">
      <section>
        <header className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-400">Step one</p>
            <h2 className="mt-1 font-display text-2xl text-stone-50 sm:text-3xl">How are you feeling?</h2>
          </div>
        </header>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {MOOD_OPTIONS.map((option) => {
            const Icon = MOOD_ICONS[option.value];
            const selected = mood === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onMoodChange(option.value)}
                className={`group flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  selected
                    ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_0_1px_rgba(251,191,36,0.4)]'
                    : 'border-stone-800 bg-stone-900/60 hover:border-stone-600 hover:bg-stone-900'
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    selected ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-amber-300 group-hover:bg-stone-700'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-base font-semibold text-stone-100">{option.label}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-stone-400">{option.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <header className="mb-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-400">Step two</p>
          <h2 className="mt-1 font-display text-2xl text-stone-50 sm:text-3xl">What's the weather like?</h2>
        </header>
        <div className="flex flex-wrap gap-3">
          {WEATHER_OPTIONS.map((option) => {
            const Icon = WEATHER_ICONS[option.value];
            const selected = weather === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                title={option.description}
                onClick={() => onWeatherChange(option.value)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  selected
                    ? 'border-amber-400 bg-amber-400 text-stone-950'
                    : 'border-stone-700 bg-stone-900/60 text-stone-200 hover:border-stone-500 hover:text-stone-50'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by type">
        {KIND_OPTIONS.map((option) => {
          const selected = kind === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onKindChange(option.value)}
              className={`rounded-full px-4 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                selected ? 'bg-stone-100 text-stone-950' : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
