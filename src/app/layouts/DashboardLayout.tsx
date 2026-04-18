import { Outlet, useNavigate, useLocation } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Home, BookOpen, TrendingUp, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DashboardLayout() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: t('nav.dashboard') },
    { path: '/english', icon: BookOpen, label: t('nav.modules') },
    { path: '/progress', icon: TrendingUp, label: t('nav.progress') },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="h-16 bg-white border-b border-border flex items-center px-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <span className="text-white">📚</span>
          </div>
          <div className="ml-3">
            <h2 className="text-base bg-gradient-to-r from-[#7c6f5f] via-[#8b9d83] to-[#a67c8a] bg-clip-text text-transparent">
              Triple Genius
            </h2>
          </div>
        </div>

        <div className="p-4">
          <Outlet />
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    active
                      ? 'text-primary bg-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📚</span>
            </div>
            <div>
              <h2 className="text-lg bg-gradient-to-r from-[#7c6f5f] via-[#8b9d83] to-[#a67c8a] bg-clip-text text-transparent">
                Triple Genius
              </h2>
              <p className="text-xs text-muted-foreground">{t('dashboard.title')}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
