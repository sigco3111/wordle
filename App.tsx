import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import StatsView from './components/StatsView';
import HowToPlay from './components/HowToPlay';
import { ChartBarIcon } from './components/icons/ChartBarIcon';
import { QuestionMarkCircleIcon } from './components/icons/QuestionMarkCircleIcon';
import { XIcon } from './components/icons/XIcon';
import { getSecretWord } from './services/wordService';
import { loadStats, saveStats, updateStats } from './services/statsService';
import { WORD_LENGTH, MAX_GUESSES } from './constants';
import { LetterStatus, GameStatus, type Guess, type KeyboardStatuses, type GameStats } from './types';

const HAS_SEEN_HELP_KEY = 'wordle-has-seen-help';

const App: React.FC = () => {
  const [secretWord, setSecretWord] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Playing);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [keyboardStatuses, setKeyboardStatuses] = useState<KeyboardStatuses>({});
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState<boolean>(false);
  const [submittedRowIndex, setSubmittedRowIndex] = useState<number | null>(null);
  const [shakeRowIndex, setShakeRowIndex] = useState<number | null>(null);
  const [stats, setStats] = useState<GameStats>(loadStats());

  useEffect(() => {
    saveStats(stats);
  }, [stats]);
  
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem(HAS_SEEN_HELP_KEY);
    if (!hasSeenHelp) {
        setIsHowToPlayModalOpen(true);
        localStorage.setItem(HAS_SEEN_HELP_KEY, 'true');
    }
  }, []);

  const showToast = (message: string, duration: number = 2000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), duration);
  };

  const resetGame = useCallback(() => {
    setSecretWord(getSecretWord());
    setGameStatus(GameStatus.Playing);
    setGuesses([]);
    setCurrentGuess('');
    setKeyboardStatuses({});
    setIsStatsModalOpen(false);
    setSubmittedRowIndex(null);
  }, []);

  useEffect(() => {
    if (!secretWord) {
      setSecretWord(getSecretWord());
    }
  }, [secretWord]);

  const handleEndGame = useCallback((endGameStatus: GameStatus) => {
    setGameStatus(endGameStatus);
    const newStats = updateStats(stats, endGameStatus, guesses.length + (endGameStatus === GameStatus.Won ? 1 : 0));
    setStats(newStats);
    
    const winDelay = 1500; // Delay for win animation
    const loseDelay = 500;
    
    setTimeout(() => {
      setIsStatsModalOpen(true);
    }, endGameStatus === GameStatus.Won ? winDelay : loseDelay);
  }, [stats, guesses.length]);

  const handleSubmit = useCallback(() => {
    if (gameStatus !== GameStatus.Playing) return;
    
    if (currentGuess.length !== WORD_LENGTH) {
      showToast('5글자 단어를 입력해주세요');
      setShakeRowIndex(guesses.length);
      setTimeout(() => setShakeRowIndex(null), 500);
      return;
    }

    const newStatuses: LetterStatus[] = Array(WORD_LENGTH).fill(LetterStatus.Absent);
    const secretWordLetterCounts: { [key: string]: number } = {};
    for (const letter of secretWord) {
      secretWordLetterCounts[letter] = (secretWordLetterCounts[letter] || 0) + 1;
    }

    // First pass: Find correct letters
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (currentGuess[i] === secretWord[i]) {
        newStatuses[i] = LetterStatus.Correct;
        secretWordLetterCounts[currentGuess[i]]--;
      }
    }

    // Second pass: Find present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (newStatuses[i] !== LetterStatus.Correct && secretWordLetterCounts[currentGuess[i]] > 0) {
        newStatuses[i] = LetterStatus.Present;
        secretWordLetterCounts[currentGuess[i]]--;
      }
    }

    const newGuess: Guess = { word: currentGuess, statuses: newStatuses };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setSubmittedRowIndex(guesses.length);

    const newKeyboardStatuses = { ...keyboardStatuses };
    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = currentGuess[i];
      const currentStatus = newKeyboardStatuses[letter];
      const newStatus = newStatuses[i];
      if (!currentStatus || newStatus === LetterStatus.Correct || (newStatus === LetterStatus.Present && currentStatus !== LetterStatus.Correct)) {
        newKeyboardStatuses[letter] = newStatus;
      }
    }
    setKeyboardStatuses(newKeyboardStatuses);

    setCurrentGuess('');

    if (currentGuess === secretWord) {
      handleEndGame(GameStatus.Won);
    } else if (newGuesses.length === MAX_GUESSES) {
      handleEndGame(GameStatus.Lost);
    }
  }, [currentGuess, gameStatus, guesses, keyboardStatuses, secretWord, handleEndGame]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== GameStatus.Playing || isStatsModalOpen || isHowToPlayModalOpen) return;

    if (key === 'ENTER') {
      handleSubmit();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(g => g.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && key.length === 1 && key.match(/^[A-Z]$/)) {
      setCurrentGuess(g => g + key);
    }
  }, [currentGuess.length, gameStatus, handleSubmit, isStatsModalOpen, isHowToPlayModalOpen]);
  
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      let key = e.key.toUpperCase();
      if(isStatsModalOpen || isHowToPlayModalOpen) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      if (key === 'BACKSPACE') {
         handleKeyPress('BACKSPACE');
      } else if (key === 'ENTER') {
        handleKeyPress('ENTER');
      } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
        handleKeyPress(key);
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [handleKeyPress, isStatsModalOpen, isHowToPlayModalOpen]);
  
  const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => (
    <div 
      className={`fixed inset-0 bg-black z-20 transition-opacity duration-300 ${isOpen ? 'bg-opacity-70' : 'bg-opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`w-full max-w-md mx-auto mt-[10vh] p-4 transition-transform duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors">
              <XIcon />
          </button>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-2 sm:p-4 text-white font-sans">
      <header className="flex items-center justify-between w-full max-w-lg mx-auto border-b border-gray-700 pb-2 mb-2">
        <button onClick={() => setIsHowToPlayModalOpen(true)} className="text-gray-400 hover:text-white p-2 rounded-full transition-colors">
          <QuestionMarkCircleIcon />
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wider text-gray-100">WORDLE</h1>
        <button onClick={() => setIsStatsModalOpen(true)} className="text-gray-400 hover:text-white p-2 rounded-full transition-colors">
          <ChartBarIcon />
        </button>
      </header>
      
      <div className={`absolute top-16 transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        {toastMessage && (
          <div className="bg-white text-gray-900 px-6 py-2 rounded-lg shadow-lg font-semibold z-30">
            {toastMessage}
          </div>
        )}
      </div>

      <Modal isOpen={isHowToPlayModalOpen} onClose={() => setIsHowToPlayModalOpen(false)}>
          <HowToPlay />
      </Modal>

      <Modal isOpen={isStatsModalOpen} onClose={() => setIsStatsModalOpen(false)}>
        <div className="flex flex-col items-center gap-4 w-full">
          {gameStatus !== GameStatus.Playing && (
            <div className="text-center mb-2">
              <p className="text-gray-300">정답은:</p>
              <strong className="text-3xl text-green-400 tracking-widest font-bold">{secretWord}</strong>
            </div>
          )}
          
          <StatsView stats={stats} />
          
          {gameStatus !== GameStatus.Playing && (
            <button
              onClick={resetGame}
              className="mt-4 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
            >
              다시하기
            </button>
          )}
        </div>
      </Modal>

      <main className="flex-grow flex flex-col justify-center">
        <Board guesses={guesses} currentGuess={currentGuess} submittedRowIndex={submittedRowIndex} shakeRowIndex={shakeRowIndex}/>
      </main>
      
      <footer className="w-full max-w-lg mx-auto">
        <Keyboard onKeyPress={handleKeyPress} keyboardStatuses={keyboardStatuses} />
      </footer>
    </div>
  );
};

export default App;