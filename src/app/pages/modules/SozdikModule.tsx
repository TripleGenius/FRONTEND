import { SozdikCard } from '../../components/SozdikCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function SozdikModule() {
  const { t } = useLanguage();
  return (
    <SozdikCard title={t('module.sozdik')} icon="📖" color="from-[#8a7f73] to-[#9c9185]" />
  );
}
