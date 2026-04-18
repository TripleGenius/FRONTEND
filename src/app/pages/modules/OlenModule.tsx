import { ModuleCard } from '../../components/ModuleCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function OlenModule() {
  const { t } = useLanguage();
  return (
    <ModuleCard slug="olen" title={t('module.olen')} icon="✍️" color="from-[#c9a66b] to-[#d4b67d]" randomize />
  );
}
