import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const languages = [
    { code: 'kk' as const, label: 'Қазақша' },
    { code: 'mn' as const, label: 'Монгол' },
    { code: 'en' as const, label: 'English' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f9f6f2] via-[#fdfcfa] to-[#f5f1ec]">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-[#7c6f5f] via-[#8b9d83] to-[#a67c8a] p-[2px] rounded-2xl mb-4">
            <div className="bg-white px-8 py-4 rounded-2xl">
              <h1 className="text-3xl bg-gradient-to-r from-[#7c6f5f] via-[#8b9d83] to-[#a67c8a] bg-clip-text text-transparent">
                Triple Genius
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground">Learning Platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl">📚</span>
            </div>
            <h1 className="mb-2">{t('login.welcome')}</h1>
            <p className="text-muted-foreground">{t('login.title')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block mb-2 text-foreground">{t('login.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-foreground">{t('login.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              {t('login.button')}
            </button>
          </form>

          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-center gap-2 mb-3 text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Тіл / Хэл / Language</span>
            </div>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all ${
                    language === lang.code
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
