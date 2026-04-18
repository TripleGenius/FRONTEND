import { ModuleCard } from '../../components/ModuleCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function IQModule() {
  const { t } = useLanguage();

  const questions = [
    { question: '2, 4, 8, 16, ? - келесі сан қандай?', answer: '32' },
    { question: 'Егер A=1, B=2, C=3 болса, "CAB" = ?', answer: '3 + 1 + 2 = 6' },
    { question: '5 алма 10 теңге болса, 8 алма қанша?', answer: '16 теңге' },
    { question: 'Қай сан артық: 2, 4, 6, 9, 10?', answer: '9 (жұп емес)' },
    { question: 'Сағат 3:15-ті көрсетсе, сағат тілі мен минут тілі арасындағы бұрыш қандай?', answer: '7.5 градус' },
  ];

  return (
    <ModuleCard
      title={t('module.iq')}
      icon="🧠"
      color="from-[#7c6f5f] to-[#8f8275]"
      questions={questions}
      showTimer
    />
  );
}
