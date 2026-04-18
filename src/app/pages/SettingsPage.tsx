import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Bell, Volume2 } from 'lucide-react';

export function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'kk' as const, label: 'Қазақша', flag: '🇰🇿' },
    { code: 'mn' as const, label: 'Монгол', flag: '🇲🇳' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="mb-2">{t('nav.settings')}</h1>
        <p className="text-muted-foreground">Manage your preferences</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <h3>Language / Тіл / Хэл</h3>
        </div>
        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                language === lang.code
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-accent'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8b9d83] to-[#9faaa0] rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <h3>Notifications</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 bg-muted rounded-xl cursor-pointer">
            <span>Daily reminders</span>
            <input type="checkbox" className="w-5 h-5 rounded accent-primary" defaultChecked />
          </label>
          <label className="flex items-center justify-between p-4 bg-muted rounded-xl cursor-pointer">
            <span>Progress updates</span>
            <input type="checkbox" className="w-5 h-5 rounded accent-primary" defaultChecked />
          </label>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#c9a66b] to-[#d4b67d] rounded-xl flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          <h3>Sound Effects</h3>
        </div>
        <label className="flex items-center justify-between p-4 bg-muted rounded-xl cursor-pointer">
          <span>Enable sounds</span>
          <input type="checkbox" className="w-5 h-5 rounded accent-primary" defaultChecked />
        </label>
      </div>
    </div>
  );
}
