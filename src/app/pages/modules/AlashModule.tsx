import { ModuleCard } from '../../components/ModuleCard';
import { useLanguage } from '../../contexts/LanguageContext';

export function AlashModule() {
  const { t } = useLanguage();

  const questions = [
    { question: 'Алаш қозғалысы қашан басталды?', answer: '1917 жылы' },
    { question: 'Алаш Орданың астанасы қай қала болды?', answer: 'Семей' },
    { question: 'Алаш партиясының негізін қалаушылар кімдер?', answer: 'Әлихан Бөкейханов, Ахмет Байтұрсынов, Міржақып Дулатов' },
    { question: 'Алаш дегеніміз не?', answer: 'Қазақ халқының ұлттық-демократиялық қозғалысы' },
    { question: 'Алаш Орда қанша жыл өмір сүрді?', answer: '1917-1920 жылдар арасында' },
  ];

  return (
    <ModuleCard
      title={t('module.alash')}
      icon="🏛️"
      color="from-[#a67c8a] to-[#b88f9c]"
      questions={questions}
    />
  );
}
