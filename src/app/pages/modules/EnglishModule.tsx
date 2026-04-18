import { ModuleCard } from '../../components/ModuleCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function EnglishModule() {
  const { t } = useLanguage();

  const questions = [
    { question: 'What is the past tense of "go"?', answer: 'went' },
    { question: 'Translate: "Hello, how are you?"', answer: 'Сәлем, қалың қалай? / Сайн байна уу?' },
    { question: 'What does "beautiful" mean?', answer: 'әдемі / гоё' },
    { question: 'Complete: I ___ to school every day.', answer: 'go' },
    { question: 'What is a synonym for "happy"?', answer: 'joyful, cheerful, glad' },
  ];

  return (
    <ModuleCard
      title={t('module.english')}
      icon="🇬🇧"
      color="from-[#8b9d83] to-[#9faaa0]"
      questions={questions}
    />
  );
}
