import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { TripleGeniusBadge } from './components/TripleGeniusBadge';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <TripleGeniusBadge />
      </AuthProvider>
    </LanguageProvider>
  );
}