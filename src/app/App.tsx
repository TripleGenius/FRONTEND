import { RouterProvider } from 'react-router';
import { useEffect, useState } from 'react';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { BackendWakeup } from './components/BackendWakeup';
import { checkBackendHealth, startKeepAlive } from '../lib/keepAlive';

type Status = 'checking' | 'waking' | 'ready';

export default function App() {
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    let stopKeepAlive: (() => void) | null = null;

    const init = async () => {
      // Quick check with 2s timeout
      const quickOk = await Promise.race([
        checkBackendHealth(),
        new Promise<false>((r) => setTimeout(() => r(false), 2000)),
      ]);

      if (quickOk) {
        stopKeepAlive = startKeepAlive();
        setStatus('ready');
        return;
      }

      // Cold start — show wakeup screen and keep polling
      setStatus('waking');

      const poll = async () => {
        const ok = await checkBackendHealth();
        if (ok) {
          stopKeepAlive = startKeepAlive();
          setStatus('ready');
        } else {
          setTimeout(poll, 3000);
        }
      };
      poll();
    };

    init();

    return () => stopKeepAlive?.();
  }, []);

  if (status === 'checking' || status === 'waking') {
    return <BackendWakeup isWaking={status === 'waking'} />;
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
  );
}
