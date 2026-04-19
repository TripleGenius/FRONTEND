import { RouterProvider } from 'react-router';
import { useEffect, useState } from 'react';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { BackendWakeup } from './components/BackendWakeup';
import { checkBackendHealth, startKeepAlive } from '../lib/keepAlive';

export default function App() {
  const [backendReady, setBackendReady] = useState(false);
  const [showWakeup, setShowWakeup] = useState(false);

  useEffect(() => {
    let stopKeepAlive: (() => void) | null = null;

    const init = async () => {
      // Try a quick check first (2s timeout)
      const quickCheck = await Promise.race([
        checkBackendHealth(),
        new Promise<false>((r) => setTimeout(() => r(false), 2000)),
      ]);

      if (quickCheck) {
        setBackendReady(true);
        stopKeepAlive = startKeepAlive();
        return;
      }

      // Backend is cold — show wakeup screen, keep polling
      setShowWakeup(true);

      const poll = async () => {
        const ok = await checkBackendHealth();
        if (ok) {
          setBackendReady(true);
          setShowWakeup(false);
          stopKeepAlive = startKeepAlive();
        } else {
          setTimeout(poll, 3000);
        }
      };
      poll();
    };

    init();

    return () => stopKeepAlive?.();
  }, []);

  if (showWakeup && !backendReady) {
    return <BackendWakeup onReady={() => setBackendReady(true)} />;
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
  );
}
