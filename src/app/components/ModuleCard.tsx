import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { ChevronLeft, Timer, Shuffle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { modulesApi, progressApi } from '../../lib/api';
import { Question } from '../../lib/types';

interface DisplayQuestion extends Question {
  flipped?: boolean;
}

interface ModuleCardProps {
  slug: string;
  title: string;
  icon: string;
  color: string;
  showTimer?: boolean;
  randomize?: boolean;  // санамсаргүй дараалал
  flipable?: boolean;   // question↔answer урвуу асуух (Alash)
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function ModuleCard({
  slug, title, icon, color,
  showTimer = false,
  randomize = false,
  flipable = false,
}: ModuleCardProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [rawQuestions, setRawQuestions] = useState<Question[]>([]);
  const [displayQuestions, setDisplayQuestions] = useState<DisplayQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer] = useState(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());

  const buildDisplayList = useCallback((qs: Question[]) => {
    let list: DisplayQuestion[] = qs.map((q) => ({ ...q }));

    if (flipable) {
      list = list.map((q) =>
        Math.random() > 0.5
          ? q
          : { ...q, question: q.answer, answer: q.question, flipped: true }
      );
    }

    if (randomize) {
      list = shuffle(list);
    }

    return list;
  }, [randomize, flipable]);

  useEffect(() => {
    modulesApi.getQuestions(slug, language)
      .then((qs) => {
        setRawQuestions(qs);
        setDisplayQuestions(buildDisplayList(qs));
      })
      .finally(() => setLoading(false));
  }, [slug, language]);

  const handleReshuffle = () => {
    setDisplayQuestions(buildDisplayList(rawQuestions));
    setCurrentIndex(0);
    setShowAnswer(false);
    setAnswered(new Set());
  };

  const current = displayQuestions[currentIndex];
  const progress = displayQuestions.length
    ? ((answered.size) / displayQuestions.length) * 100
    : 0;
  const allAnswered = answered.size === displayQuestions.length;

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setAnswered((prev) => new Set(prev).add(currentIndex));
  };

  const handleNext = async () => {
    if (currentIndex < displayQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      await progressApi.update(slug, answered.size).catch(() => {});
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      if (!showAnswer) {
        handleShowAnswer();
      } else {
        handleNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAnswer, currentIndex, answered, displayQuestions.length]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-12 bg-muted rounded-2xl animate-pulse" />
        <div className="h-64 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!displayQuestions.length) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Асуулт олдсонгүй</p>
      </div>
    );
  }

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
            {randomize && (
              <button
                onClick={handleReshuffle}
                className="ml-auto w-8 h-8 rounded-lg bg-muted hover:bg-accent transition-colors flex items-center justify-center"
                title="Дахин холих"
              >
                <Shuffle className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${color} transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{answered.size} / {displayQuestions.length} хариулсан</span>
            {current?.flipped && (
              <span className="text-primary/70">↔ урвуу</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} / {displayQuestions.length}
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
              className="text-center w-full"
            >
              <p className="text-xl mb-6 whitespace-pre-wrap">{current.question}</p>

              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-gradient-to-br ${color} bg-opacity-10 rounded-xl p-6 border border-primary/20`}
                >
                  <p className="text-lg whitespace-pre-wrap">{current.answer}</p>
                  {current.explanation && !current.flipped && (
                    <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">
                      {current.explanation}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="flex gap-3">
            {!showAnswer ? (
              <button
                onClick={handleShowAnswer}
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
                  disabled={currentIndex === displayQuestions.length - 1 && !allAnswered}
                  className={`flex-1 py-3 rounded-xl transition-opacity ${
                    allAnswered && currentIndex === displayQuestions.length - 1
                      ? `bg-gradient-to-r ${color} text-white hover:opacity-90`
                      : 'bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {currentIndex === displayQuestions.length - 1
                    ? allAnswered
                      ? t('common.complete')
                      : `${displayQuestions.length - answered.size} үлдсэн`
                    : t('common.next')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        {displayQuestions.slice(0, 30).map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentIndex(index); setShowAnswer(false); }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-8'
                : answered.has(index)
                ? 'bg-primary/50'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
