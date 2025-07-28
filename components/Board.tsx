
import React from 'react';
import { MAX_GUESSES, WORD_LENGTH } from '../constants';
import { LetterStatus, type Guess } from '../types';

interface BoardProps {
  guesses: Guess[];
  currentGuess: string;
  submittedRowIndex: number | null;
  shakeRowIndex: number | null;
}

const getStatusColor = (status: LetterStatus) => {
  switch (status) {
    case LetterStatus.Correct:
      return 'bg-green-500 border-green-500';
    case LetterStatus.Present:
      return 'bg-yellow-500 border-yellow-500';
    case LetterStatus.Absent:
      return 'bg-gray-700 border-gray-700';
    default:
      return 'bg-gray-950 border-gray-600';
  }
};

const Board: React.FC<BoardProps> = ({ guesses, currentGuess, submittedRowIndex, shakeRowIndex }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 my-4">
      {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
        const isSubmitted = rowIndex < guesses.length;
        const isCurrentRow = rowIndex === guesses.length;
        const guess = isSubmitted ? guesses[rowIndex] : null;
        const isFlipping = submittedRowIndex === rowIndex;
        const isShaking = shakeRowIndex === rowIndex;
        const isWinningRow = isSubmitted && guess?.statuses.every(s => s === LetterStatus.Correct);

        return (
          <div key={rowIndex} className={`grid grid-cols-5 gap-1.5 ${isShaking ? 'animate-shake' : ''}`}>
            {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
              const letter = isCurrentRow
                ? currentGuess[colIndex]
                : guess?.word[colIndex];
              const status = guess ? guess.statuses[colIndex] : LetterStatus.Empty;
              const isFilled = !!letter;
              
              const flipDelay = isFlipping ? `${colIndex * 100}ms` : '0ms';
              const jumpDelay = isWinningRow ? `${colIndex * 100}ms` : '0ms';

              const cellBaseClasses = 'flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 text-3xl font-bold uppercase transition-all duration-500';
              const borderClass = isFilled ? 'border-gray-400 scale-105' : 'border-gray-700';

              const flipContainerClasses = `relative ${cellBaseClasses} [transform-style:preserve-3d] ${isFlipping ? '[transform:rotateX(180deg)]' : ''}`;
              
              const frontFaceClasses = 'absolute w-full h-full flex items-center justify-center border-2 [backface-visibility:hidden]';
              const backFaceClasses = 'absolute w-full h-full flex items-center justify-center [backface-visibility:hidden] [transform:rotateX(180deg)]';
              
              const jumpAnimationClasses = isWinningRow ? 'animate-jump' : '';

              return (
                <div 
                  key={colIndex} 
                  className={`${flipContainerClasses} ${jumpAnimationClasses}`} 
                  style={{ transitionDelay: flipDelay, animationDelay: jumpDelay }}
                >
                  <div className={`${frontFaceClasses} ${isSubmitted ? getStatusColor(LetterStatus.Empty) : borderClass} transition-transform duration-200`}>
                    {isSubmitted ? '' : letter}
                  </div>
                  <div className={`${backFaceClasses} ${getStatusColor(status)}`}>
                    {letter}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;