import { ModuleCard } from '../../components/ModuleCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function TapqirliqModule() {
  const { t } = useLanguage();

  const questions = [
    { question: 'Үйде 4 бұрыш бар. Әр бұрышта бір мысық отыр. Әр мысықтың қарсысында 3 мысық бар. Барлығы неше мысық?', answer: '4 мысық' },
    { question: 'Жылына бір рет келетін, айына екі рет келетін, аптасына келмейтін - бұл не?', answer: 'Е әрпі' },
    { question: 'Суда өлмейді, отта күймейді - бұл не?', answer: 'Мұз' },
    { question: 'Қанатсыз ұшады, аяқсыз жүгіреді - бұл не?', answer: 'Бұлт' },
    { question: 'Күндіз көрінбейді, түнде көрінеді, жұлдыз емес - бұл не?', answer: 'Түс (арман)' },
  ];

  return (
    <ModuleCard
      title={t('module.tapqirliq')}
      icon="💡"
      color="from-[#9b8b7e] to-[#ad9d90]"
      questions={questions}
    />
  );
}
