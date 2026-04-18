import { ModuleCard } from '../../components/ModuleCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function SozdikModule() {
  const { t } = useLanguage();

  const questions = [
    { question: '"Білім" сөзінің мағынасы не?', answer: 'Ақыл-ой, сана-сезім арқылы алынған мәлімет, ғылым' },
    { question: '"Мейірім" дегеніміз не?', answer: 'Жанашырлық, қамқорлық, ізгілік сезім' },
    { question: '"Ынтымақ" сөзі қалай түсіндіріледі?', answer: 'Бірлік, татулық, ұйым' },
    { question: '"Қайырым" деген не?', answer: 'Жақсылық, игілік іс, садақа' },
    { question: '"Парасат" дегеніміз не?', answer: 'Ақылдылық, данышпандық, даналық' },
  ];

  return (
    <ModuleCard
      title={t('module.sozdik')}
      icon="📖"
      color="from-[#8a7f73] to-[#9c9185]"
      questions={questions}
    />
  );
}
