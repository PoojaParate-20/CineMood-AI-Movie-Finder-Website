import { useCallback, useEffect, useState } from 'react';
import type { Kind } from '@/lib/cinemood';
import {
  addToWatchlist,
  fetchWatchlist,
  removeFromWatchlist,
  type WatchlistInput,
  type WatchlistItem,
} from '@/lib/watchlist';

function describeError(err: unknown): string {
  return err instanceof Error ? err.message : 'Something went wrong. Please try again.';
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingKeys, setPendingKeys] = useState<ReadonlySet<string>>(new Set());

  const refresh = useCallback(async () => {
    setItems(await fetchWatchlist());
  }, []);

  useEffect(() => {
    let active = true;
    refresh()
      .catch((err: unknown) => {
        if (active) setLoadError(describeError(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refresh]);

  const runAction = useCallback(async (key: string, action: () => Promise<void>) => {
    setPendingKeys((prev) => new Set(prev).add(key));
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError(describeError(err));
    } finally {
      setPendingKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }, []);

  const findSaved = useCallback(
    (title: string, kind: Kind) => items.find((item) => item.title === title && item.kind === kind),
    [items],
  );

  const toggle = useCallback(
    (input: WatchlistInput) => {
      const existing = findSaved(input.title, input.kind);
      const key = `${input.kind}:${input.title}`;
      return runAction(key, async () => {
        if (existing) {
          await removeFromWatchlist(existing.id);
          setItems((prev) => prev.filter((item) => item.id !== existing.id));
        } else {
          await addToWatchlist(input);
          await refresh();
        }
      });
    },
    [findSaved, refresh, runAction],
  );

  const remove = useCallback(
    (id: string) =>
      runAction(`id:${id}`, async () => {
        await removeFromWatchlist(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
      }),
    [runAction],
  );

  const isPending = useCallback((key: string) => pendingKeys.has(key), [pendingKeys]);

  return {
    items,
    loading,
    loadError,
    actionError,
    isSaved: (title: string, kind: Kind) => findSaved(title, kind) !== undefined,
    isPending,
    toggle,
    remove,
    retry: refresh,
  };
}
