import { ModuleCard } from '../../components/ModuleCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function OlenModule() {
  const { t } = useLanguage();

  const questions = [
    {
      question: '"Мен қазақпын мың өліп, мың тірілген..." деген өлең жолының авторы кім?',
      answer: 'Жұмекен Нәжімеденов',
    },
    {
      question: 'Абайдың "Қараңғы түнде тау қалғып" өлеңі не туралы?',
      answer: 'Табиғат сұлулығы мен адам жанының қатынасы туралы',
    },
    {
      question: '"Өлсең де өлмейтұғын өмір сүр" деп кім айтқан?',
      answer: 'Абай Құнанбаев',
    },
    {
      question: 'Мағжан Жұмабаевтың танымал өлеңдерінің бірі?',
      answer: '"Батыр Баян", "Түркістан"',
    },
    {
      question: 'Шәкәрімнің философиялық өлеңдері не туралы?',
      answer: 'Адам жаны, рухани тазалық, өмір мәні туралы',
    },
  ];

  return (
    <ModuleCard
      title={t('module.olen')}
      icon="✍️"
      color="from-[#c9a66b] to-[#d4b67d]"
      questions={questions}
    />
  );
}
