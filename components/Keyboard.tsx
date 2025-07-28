
import React from 'react';
import { KEYBOARD_LAYOUT } from '../constants';
import { LetterStatus, type KeyboardStatuses } from '../types';
import { BackspaceIcon } from './icons/BackspaceIcon';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardStatuses: KeyboardStatuses;
}

const getStatusColor = (status?: LetterStatus) => {
  switch (status) {
    case LetterStatus.Correct:
      return 'bg-green-500 hover:bg-green-400 text-white';
    case LetterStatus.Present:
      return 'bg-yellow-500 hover:bg-yellow-400 text-white';
    case LetterStatus.Absent:
      return 'bg-gray-700 hover:bg-gray-600 text-white';
    default:
      return 'bg-gray-600 hover:bg-gray-500 text-gray-200';
  }
};

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardStatuses }) => {
  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const status = keyboardStatuses[key];
            const isSpecialKey = key === 'ENTER' || key === 'BACKSPACE';
            const buttonClasses = `
              h-14 rounded-md font-bold uppercase flex items-center justify-center transition-all duration-200 transform active:scale-95
              ${isSpecialKey ? 'px-4 text-xs' : 'w-8 sm:w-11 text-lg'}
              ${getStatusColor(status)}
            `;
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={buttonClasses}
                aria-label={key}
              >
                {key === 'BACKSPACE' ? <BackspaceIcon /> : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;