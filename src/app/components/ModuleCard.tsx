import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { ChevronLeft, Timer } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Question {
  question: string;
  answer: string;
}

interface ModuleCardProps {
  title: string;
  icon: string;
  color: string;
  questions: Question[];
  showTimer?: boolean;
}

export function ModuleCard({ title, icon, color, questions, showTimer = false }: ModuleCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(0);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center hover:bg-accent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-xl`}>
              {icon}
            </div>
            <h2>{title}</h2>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${color} transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} / {questions.length}
            </div>
            {showTimer && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="w-4 h-4" />
                <span>{timer}s</span>
              </div>
            )}
          </div>

          <div className="min-h-[200px] flex items-center justify-center mb-8">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <p className="text-xl mb-6">{currentQuestion.question}</p>

              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-gradient-to-br ${color} bg-opacity-10 rounded-xl p-6 border border-primary/20`}
                >
                  <p className="text-lg">{currentQuestion.answer}</p>
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="flex gap-3">
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className={`flex-1 bg-gradient-to-r ${color} text-white py-3 rounded-xl hover:opacity-90 transition-opacity`}
              >
                {t('common.showAnswer')}
              </button>
            ) : (
              <>
                {currentIndex > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-accent transition-colors"
                  >
                    {t('common.back')}
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                  className={`flex-1 bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {currentIndex === questions.length - 1 ? t('common.complete') : t('common.next')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setShowAnswer(false);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-8'
                : index < currentIndex
                ? 'bg-primary/50'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
