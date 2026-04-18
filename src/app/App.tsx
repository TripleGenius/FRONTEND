import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { TripleGeniusBadge } from './components/TripleGeniusBadge';

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
      <TripleGeniusBadge />
    </LanguageProvider>
  );
}