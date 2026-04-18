import { ModuleCard } from '../../components/ModuleCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function TapqirliqModule() {
  const { t } = useLanguage();
  return (
    <ModuleCard slug="tapqirliq" title={t('module.tapqirliq')} icon="💡" color="from-[#9b8b7e] to-[#ad9d90]" />
  );
}
