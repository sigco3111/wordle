import React from 'react';
import { GameStats } from '../types';

interface StatsViewProps {
  stats: GameStats;
}

const StatsView: React.FC<StatsViewProps> = ({ stats }) => {
  const { played, wins, currentStreak, maxStreak, guessDistribution } = stats;
  const winPercentage = played > 0 ? Math.round((wins / played) * 100) : 0;
  
  const maxDistributionValue = Math.max(...Object.values(guessDistribution), 1);

  return (
    <div className="text-white w-full max-w-sm mx-auto">
      <h3 className="text-xl font-bold tracking-widest text-center mb-4">통계</h3>
      
      <div className="flex justify-around text-center gap-2 mb-6">
        <div>
          <p className="text-3xl font-bold">{played}</p>
          <p className="text-xs font-medium text-gray-400">플레이</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{winPercentage}</p>
          <p className="text-xs font-medium text-gray-400">승률 %</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{currentStreak}</p>
          <p className="text-xs font-medium text-gray-400">현재 연승</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{maxStreak}</p>
          <p className="text-xs font-medium text-gray-400">최대 연승</p>
        </div>
      </div>

      <h3 className="text-xl font-bold tracking-widest text-center mb-4">추측 분포</h3>
      <div className="w-full px-2 space-y-2">
        {Object.entries(guessDistribution).map(([guesses, count]) => {
          const barWidth = count > 0 ? `${(count / maxDistributionValue) * 100}%` : '0%';
          
          return (
            <div key={guesses} className="flex items-center gap-2 text-sm font-bold w-full">
              <div className="w-3 text-gray-300">{guesses}</div>
              <div className="relative flex-1 bg-gray-700 h-5 rounded-sm flex items-center justify-start">
                 {count > 0 ? (
                  <div 
                    className="h-full bg-green-600 rounded-sm flex items-center justify-end pr-2" 
                    style={{ width: barWidth }}
                  >
                    <span className="text-white font-bold">{count}</span>
                  </div>
                 ) : (
                   <span className="text-gray-400 font-bold pl-2">{count}</span>
                 )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default StatsView;