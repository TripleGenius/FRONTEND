import { ModuleCard } from '../../components/ModuleCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function EnglishModule() {
  const { t } = useLanguage();
  return (
    <ModuleCard slug="english" title={t('module.english')} icon="🇬🇧" color="from-[#8b9d83] to-[#9faaa0]" randomize flipable />
  );
}
