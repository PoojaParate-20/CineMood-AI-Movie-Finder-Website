export type Mood =
  | 'happy'
  | 'melancholy'
  | 'adrenaline'
  | 'romantic'
  | 'cozy'
  | 'anxious'
  | 'curious'
  | 'nostalgic';

export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';

export type Kind = 'movie' | 'tv';

export type KindFilter = 'all' | Kind;

export interface Title {
  id: string;
  title: string;
  kind: Kind;
  year: string;
  genres: string[];
  moods: Mood[];
  weather: Weather[];
  blurb: string;
}

export interface Recommendation extends Title {
  score: number;
  matchesMood: boolean;
  matchesWeather: boolean;
}

export const MOOD_OPTIONS: { value: Mood; label: string; description: string }[] = [
  { value: 'happy', label: 'Happy', description: 'Light, joyful, easy to love' },
  { value: 'melancholy', label: 'Melancholy', description: 'Bittersweet and reflective' },
  { value: 'adrenaline', label: 'Adrenaline', description: 'Fast, high stakes, heart-pounding' },
  { value: 'romantic', label: 'Romantic', description: 'Tender, warm, and hopeful' },
  { value: 'cozy', label: 'Cozy', description: 'Gentle comfort for a slow evening' },
  { value: 'anxious', label: 'Tense', description: 'Suspenseful and hard to look away from' },
  { value: 'curious', label: 'Curious', description: 'Puzzles, big ideas, and wonder' },
  { value: 'nostalgic', label: 'Nostalgic', description: 'Familiar feelings and old memories' },
];

export const WEATHER_OPTIONS: { value: Weather; label: string; description: string }[] = [
  { value: 'sunny', label: 'Sunny', description: 'Bright skies and open windows' },
  { value: 'cloudy', label: 'Cloudy', description: 'Grey, mellow, and unhurried' },
  { value: 'rainy', label: 'Rainy', description: 'Drizzle against the window' },
  { value: 'stormy', label: 'Stormy', description: 'Thunder, wind, and tension in the air' },
  { value: 'snowy', label: 'Snowy', description: 'Quiet, frosty, and still' },
];

export const KIND_OPTIONS: { value: KindFilter; label: string }[] = [
  { value: 'all', label: 'Everything' },
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
];

const MOOD_SCORE = 3;
const WEATHER_SCORE = 2;

export function recommendTitles(
  catalog: Title[],
  mood: Mood,
  weather: Weather,
  kind: KindFilter,
): Recommendation[] {
  return catalog
    .filter((title) => kind === 'all' || title.kind === kind)
    .map((title) => {
      const matchesMood = title.moods.includes(mood);
      const matchesWeather = title.weather.includes(weather);
      const score = (matchesMood ? MOOD_SCORE : 0) + (matchesWeather ? WEATHER_SCORE : 0);
      return { ...title, score, matchesMood, matchesWeather };
    })
    .filter((title) => title.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

export function moodLabel(mood: Mood): string {
  return MOOD_OPTIONS.find((option) => option.value === mood)?.label ?? mood;
}

export function weatherLabel(weather: Weather): string {
  return WEATHER_OPTIONS.find((option) => option.value === weather)?.label ?? weather;
}
