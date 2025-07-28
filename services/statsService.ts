import { GameStats, GameStatus } from '../types';
import { MAX_GUESSES } from '../constants';

const STATS_KEY = 'wordle-game-stats';

export const defaultStats: GameStats = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
};

export function loadStats(): GameStats {
  try {
    const statsJson = localStorage.getItem(STATS_KEY);
    if (statsJson) {
      const storedStats = JSON.parse(statsJson);
      // Ensure all keys are present by merging with defaults
      return { 
        ...defaultStats, 
        ...storedStats, 
        guessDistribution: {
            ...defaultStats.guessDistribution, 
            ...storedStats.guessDistribution
        } 
      };
    }
  } catch (e) {
    console.error("Failed to parse stats from localStorage", e);
  }
  return defaultStats;
}

export function saveStats(stats: GameStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to save stats to localStorage", e);
  }
}

export function updateStats(
  prevStats: GameStats,
  gameStatus: GameStatus,
  guessCount: number
): GameStats {
  const newStats: GameStats = { 
      ...prevStats,
      played: prevStats.played + 1 
  };

  if (gameStatus === GameStatus.Won) {
    newStats.wins += 1;
    newStats.currentStreak += 1;
    if (newStats.currentStreak > newStats.maxStreak) {
      newStats.maxStreak = newStats.currentStreak;
    }
    if (guessCount >= 1 && guessCount <= MAX_GUESSES) {
      newStats.guessDistribution[guessCount] = (newStats.guessDistribution[guessCount] || 0) + 1;
    }
  } else if (gameStatus === GameStatus.Lost) {
    newStats.currentStreak = 0;
  }

  return newStats;
}
