import { ModuleCard } from '../../components/ModuleCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function AlashModule() {
  const { t } = useLanguage();
  return (
    <ModuleCard slug="alash" title={t('module.alash')} icon="🏛️" color="from-[#a67c8a] to-[#b88f9c]" randomize flipable />
  );
}
