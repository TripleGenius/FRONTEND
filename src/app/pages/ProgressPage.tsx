import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { progressApi } from '../../lib/api';
import { Progress } from '../../lib/types';
import { TrendingUp, Award, Target } from 'lucide-react';

export function ProgressPage() {
  const { t } = useLanguage();
  const [modules, setModules] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressApi.getAll()
      .then(setModules)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const overallProgress = modules.length
    ? Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length)
    : 0;
  const totalCompleted = modules.reduce((sum, m) => sum + m.completed, 0);
  const totalRemaining = modules.reduce((sum, m) => sum + (m.total - m.completed), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2">{t('nav.progress')}</h1>
        <p className="text-muted-foreground">Track your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3>Overall</h3>
          </div>
          <p className="text-3xl mb-1">{overallProgress}%</p>
          <p className="text-sm text-muted-foreground">Average progress</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#8b9d83] to-[#9faaa0] rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3>Completed</h3>
          </div>
          <p className="text-3xl mb-1">{totalCompleted}</p>
          <p className="text-sm text-muted-foreground">Total lessons</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c9a66b] to-[#d4b67d] rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3>Remaining</h3>
          </div>
          <p className="text-3xl mb-1">{totalRemaining}</p>
          <p className="text-sm text-muted-foreground">Lessons to go</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="mb-6">Module Progress</h3>
        <div className="space-y-4">
          {modules.map((module) => (
            <div key={module.moduleSlug}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{module.icon}</span>
                  <span className="text-sm">{t(`module.${module.moduleSlug}`)}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">
                    {module.completed}/{module.total}
                  </span>
                  <span className="text-sm ml-2">{module.progress}%</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${module.color} transition-all duration-500`}
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
