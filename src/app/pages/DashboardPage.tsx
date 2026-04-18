import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, ChevronRight } from 'lucide-react';

export function DashboardPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const modules = [
    { id: 'english', path: '/english', icon: '🇬🇧', color: 'from-[#8b9d83] to-[#9faaa0]', progress: 65 },
    { id: 'alash', path: '/alash', icon: '🏛️', color: 'from-[#a67c8a] to-[#b88f9c]', progress: 42 },
    { id: 'olen', path: '/olen', icon: '✍️', color: 'from-[#c9a66b] to-[#d4b67d]', progress: 78 },
    { id: 'iq', path: '/iq', icon: '🧠', color: 'from-[#7c6f5f] to-[#8f8275]', progress: 55 },
    { id: 'tapqirliq', path: '/tapqirliq', icon: '💡', color: 'from-[#9b8b7e] to-[#ad9d90]', progress: 30 },
    { id: 'sozdik', path: '/sozdik', icon: '📖', color: 'from-[#8a7f73] to-[#9c9185]', progress: 88 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.progress')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => navigate(module.path)}
            className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-200 text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center text-2xl`}>
                {module.icon}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            <h3 className="mb-3">{t(`module.${module.id}`)}</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('dashboard.progress')}</span>
                <span className="text-foreground">{module.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${module.color} transition-all duration-300`}
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">{t('dashboard.continue')}</h3>
            <p className="text-muted-foreground mb-4">
              Continue learning with English module
            </p>
            <button
              onClick={() => navigate('/english')}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              {t('dashboard.continue')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
