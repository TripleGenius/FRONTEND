import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, AlignLeft, Shuffle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { modulesApi, progressApi } from '../../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface SozdikWord {
  word: string;
  meanings: string[];
}

const KAZAKH_CHARS = ['Ә', 'Ғ', 'Қ', 'Ң', 'Ө', 'Ү', 'Ұ', 'І'];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function searchWords(words: SozdikWord[], query: string): SozdikWord[] {
  const q = query.toUpperCase().trim();
  if (!q) return [];
  return words
    .filter((w) => w.word.startsWith(q))
    .sort((a, b) => {
      const aExact = a.word === q;
      const bExact = b.word === q;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return a.word.localeCompare(b.word);
    });
}

interface SozdikCardProps {
  title: string;
  icon: string;
  color: string;
}

export function SozdikCard({ title, icon, color }: SozdikCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const showKazakhChars = (user?.name ?? '').trim().toLowerCase().startsWith('nur');
  const [allWords, setAllWords] = useState<SozdikWord[]>([]);
  const [displayWords, setDisplayWords] = useState<SozdikWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [isRandom, setIsRandom] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SozdikWord[]>([]);
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    modulesApi.getSozdikWords()
      .then((words) => {
        setAllWords(words);
        setDisplayWords([...words]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSearchResults(searchWords(allWords, searchQuery));
  }, [searchQuery, allWords]);

  const buildList = (words: SozdikWord[], random: boolean) =>
    random ? shuffle([...words]) : [...words];

  const handleToggleMode = () => {
    const newRandom = !isRandom;
    setIsRandom(newRandom);
    setDisplayWords(buildList(allWords, newRandom));
    setCurrentIndex(0);
    setShowAnswer(false);
    setAnswered(new Set());
  };

  const handleInsertChar = (char: string) => {
    const input = searchRef.current;
    if (!input) return;
    const start = input.selectionStart ?? searchQuery.length;
    const end = input.selectionEnd ?? searchQuery.length;
    const newVal = searchQuery.slice(0, start) + char + searchQuery.slice(end);
    setSearchQuery(newVal);
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + 1, start + 1);
    }, 0);
  };

  const handleJumpToWord = (word: SozdikWord) => {
    const idx = displayWords.findIndex((w) => w.word === word.word);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setShowAnswer(false);
    }
    setExpandedWord(expandedWord === word.word ? null : word.word);
  };

  const current = displayWords[currentIndex];
  const progress = displayWords.length ? (answered.size / displayWords.length) * 100 : 0;
  const allAnswered = answered.size === displayWords.length;

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setAnswered((prev) => {
      const next = new Set(prev).add(currentIndex);
      progressApi.update('sozdik', next.size).catch(() => {});
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < displayWords.length - 1) {
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement === searchRef.current) return;
      if (e.key !== 'Enter') return;
      if (!showAnswer) handleShowAnswer();
      else handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAnswer, currentIndex, answered, displayWords.length]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-12 bg-muted rounded-2xl animate-pulse" />
        <div className="h-64 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!displayWords.length) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Сөздер табылмады</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
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
          <div className="text-xs text-muted-foreground mt-1">
            {answered.size} / {displayWords.length} хариулсан
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Left: flashcard */}
        <div className="md:col-span-2 bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {displayWords.length}
              </span>
              <button
                onClick={handleToggleMode}
                className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg border transition-colors ${
                  isRandom
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {isRandom ? <Shuffle className="w-3 h-3" /> : <AlignLeft className="w-3 h-3" />}
                {isRandom ? 'Ретсіз' : 'Ретті'}
              </button>
            </div>

            <div className="min-h-[180px] flex items-center justify-center mb-6">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center w-full"
              >
                <p className="text-2xl font-semibold mb-6">{current?.word}</p>

                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-accent rounded-xl p-5 border border-border text-left"
                  >
                    <div className={`h-1 w-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${color}`} />
                    {current?.meanings.map((m, i) => (
                      <p key={i} className="text-sm text-foreground mb-1">
                        {current.meanings.length > 1 ? `${i + 1}. ` : ''}{m}
                      </p>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>

            <div className="flex gap-3">
              {currentIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-5 py-3 bg-muted text-foreground rounded-xl hover:bg-accent transition-colors"
                >
                  Артқа
                </button>
              )}
              {!showAnswer ? (
                <button
                  onClick={handleShowAnswer}
                  className={`flex-1 bg-gradient-to-r ${color} text-white py-3 rounded-xl hover:opacity-90 transition-opacity`}
                >
                  Жауабын көрсет
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentIndex === displayWords.length - 1 && !allAnswered}
                  className={`flex-1 py-3 rounded-xl transition-opacity ${
                    allAnswered && currentIndex === displayWords.length - 1
                      ? `bg-gradient-to-r ${color} text-white hover:opacity-90`
                      : 'bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {currentIndex === displayWords.length - 1
                    ? allAnswered ? 'Аяқталды' : `${displayWords.length - answered.size} қалды`
                    : 'Келесі'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: search */}
        <div className="md:col-span-1 bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Сөз іздеу..."
              className="w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
            {showKazakhChars && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {KAZAKH_CHARS.map((ch) => (
                  <button
                    key={ch}
                    onClick={() => handleInsertChar(ch)}
                    className="text-xs px-2 py-1 bg-muted hover:bg-accent border border-border rounded-md transition-colors font-medium"
                  >
                    {ch}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="overflow-y-auto max-h-[340px]">
            {!searchQuery && (
              <p className="text-xs text-muted-foreground text-center py-6">Сөз теріңіз...</p>
            )}
            {searchQuery && searchResults.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">Олдсонгүй</p>
            )}
            {searchResults.map((w) => (
              <div key={w.word} className="border-b border-border/50 last:border-0">
                <button
                  onClick={() => handleJumpToWord(w)}
                  className="w-full text-left px-4 py-3 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{w.word}</p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {expandedWord === w.word ? '▲' : '▼'}
                    </span>
                  </div>
                  {expandedWord !== w.word && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{w.meanings[0]}</p>
                  )}
                </button>
                {expandedWord === w.word && (
                  <div className="px-4 pb-3 space-y-1">
                    {w.meanings.map((m, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        {w.meanings.length > 1 ? `${i + 1}. ` : ''}{m}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Dot indicators */}
      <div className="flex gap-2 justify-center flex-wrap">
        {displayWords.slice(0, 30).map((_, index) => (
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
