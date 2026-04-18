import { ModuleCard } from '../../components/ModuleCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function IQModule() {
  const { t } = useLanguage();
  return (
    <ModuleCard slug="iq" title={t('module.iq')} icon="🧠" color="from-[#7c6f5f] to-[#8f8275]" showTimer randomize />
  );
}
