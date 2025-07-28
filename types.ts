export enum LetterStatus {
  Correct = 'correct',
  Present = 'present',
  Absent = 'absent',
  Empty = 'empty',
}

export enum GameStatus {
  Playing = 'playing',
  Won = 'won',
  Lost = 'lost',
}

export interface Guess {
  word: string;
  statuses: LetterStatus[];
}

export interface KeyboardStatuses {
  [key: string]: LetterStatus;
}

export interface GameStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  // Key is the number of guesses (1-6), value is the count of wins with that many guesses.
  guessDistribution: { [key: number]: number };
}
