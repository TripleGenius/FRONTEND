import { ModuleCard } from '../../components/ModuleCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function SozdikModule() {
  const { t } = useLanguage();
  return (
    <ModuleCard slug="sozdik" title={t('module.sozdik')} icon="📖" color="from-[#8a7f73] to-[#9c9185]" />
  );
}
