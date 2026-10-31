import { createClient } from '@supabase/supabase-js';

const DEVICE_ID_KEY = 'cinemood-device-id';

function createDeviceId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function loadDeviceId(): string {
  const stored = localStorage.getItem(DEVICE_ID_KEY);
  if (stored) return stored;
  const created = createDeviceId();
  localStorage.setItem(DEVICE_ID_KEY, created);
  return created;
}

export const deviceId = loadDeviceId();

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    global: {
      headers: { 'x-device-id': deviceId },
    },
  },
);
