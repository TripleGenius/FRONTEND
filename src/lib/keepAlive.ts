const HEALTH_URL = `${import.meta.env.VITE_API_URL || ''}/api/health`;
const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(HEALTH_URL, { signal: AbortSignal.timeout(15000) });
    return res.ok;
  } catch {
    return false;
  }
}

export function startKeepAlive() {
  const ping = () => fetch(HEALTH_URL).catch(() => {});
  const id = setInterval(ping, INTERVAL_MS);
  return () => clearInterval(id);
}
