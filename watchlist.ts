import { deviceId, supabase } from '@/lib/supabase';
import type { Kind } from '@/lib/cinemood';

export interface WatchlistItem {
  id: string;
  title: string;
  kind: Kind;
  year: string;
}

export interface WatchlistInput {
  title: string;
  kind: Kind;
  year: string;
}

const UNIQUE_VIOLATION = '23505';

function isWatchlistItem(value: unknown): value is WatchlistItem {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === 'string' &&
    typeof row.title === 'string' &&
    (row.kind === 'movie' || row.kind === 'tv') &&
    typeof row.year === 'string'
  );
}

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
  const { data, error } = await supabase
    .from('watchlist')
    .select('id, title, kind, year')
    .order('created_at', { ascending: false });

  if (error) throw new Error("Couldn't load your watchlist.");
  if (!Array.isArray(data) || !data.every(isWatchlistItem)) {
    throw new Error("Couldn't load your watchlist.");
  }
  return data;
}

export async function addToWatchlist(input: WatchlistInput): Promise<void> {
  const { error } = await supabase
    .from('watchlist')
    .insert({ device_id: deviceId, title: input.title, kind: input.kind, year: input.year });

  if (error && error.code !== UNIQUE_VIOLATION) {
    throw new Error("Couldn't save that title. Please try again.");
  }
}

export async function removeFromWatchlist(id: string): Promise<void> {
  const { error } = await supabase.from('watchlist').delete().eq('id', id);
  if (error) throw new Error("Couldn't remove that title. Please try again.");
}
