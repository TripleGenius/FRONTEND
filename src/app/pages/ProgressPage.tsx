import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, Award, Target } from 'lucide-react';

export function ProgressPage() {
  const { t } = useLanguage();

  const modules = [
    { id: 'english', progress: 65, completed: 13, total: 20, color: 'from-[#8b9d83] to-[#9faaa0]' },
    { id: 'alash', progress: 42, completed: 8, total: 19, color: 'from-[#a67c8a] to-[#b88f9c]' },
    { id: 'olen', progress: 78, completed: 14, total: 18, color: 'from-[#c9a66b] to-[#d4b67d]' },
    { id: 'iq', progress: 55, completed: 11, total: 20, color: 'from-[#7c6f5f] to-[#8f8275]' },
    { id: 'tapqirliq', progress: 30, completed: 6, total: 20, color: 'from-[#9b8b7e] to-[#ad9d90]' },
    { id: 'sozdik', progress: 88, completed: 22, total: 25, color: 'from-[#8a7f73] to-[#9c9185]' },
  ];

  const overallProgress = Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length);

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
          <p className="text-3xl mb-1">{modules.reduce((sum, m) => sum + m.completed, 0)}</p>
          <p className="text-sm text-muted-foreground">Total lessons</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c9a66b] to-[#d4b67d] rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3>Remaining</h3>
          </div>
          <p className="text-3xl mb-1">{modules.reduce((sum, m) => sum + (m.total - m.completed), 0)}</p>
          <p className="text-sm text-muted-foreground">Lessons to go</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="mb-6">Module Progress</h3>
        <div className="space-y-4">
          {modules.map((module) => (
            <div key={module.id}>
              <div className="flex items-center justify-between mb-2">
                <span>{t(`module.${module.id}`)}</span>
                <span className="text-sm text-muted-foreground">
                  {module.completed}/{module.total}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${module.color} transition-all duration-300`}
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
