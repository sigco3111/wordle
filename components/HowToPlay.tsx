import React from 'react';

const HowToPlay: React.FC = () => {
  return (
    <div className="text-left text-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6 uppercase tracking-wider">게임 방법</h2>
      <p className="text-sm font-semibold mb-4">여섯 번의 기회 안에 단어를 맞혀보세요.</p>
      <ul className="list-disc list-inside text-sm space-y-2 mb-6">
        <li>각 추측은 5글자로 된 유효한 단어여야 합니다.</li>
        <li>제출하려면 Enter 키를 누르세요.</li>
        <li>추측 후에는 타일의 색상이 바뀌어 정답과 얼마나 가까운지 보여줍니다.</li>
      </ul>
      
      <div className="border-b border-gray-600 my-4"></div>

      <p className="font-bold mb-3">예시</p>

      <div className="space-y-5">
        <div>
          <div className="flex gap-1 mb-2">
            <div className="w-10 h-10 flex items-center justify-center bg-green-600 text-white border-green-600 font-bold text-2xl">W</div>
            <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-600 font-bold text-2xl">E</div>
            <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-600 font-bold text-2xl">A</div>
            <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-600 font-bold text-2xl">R</div>
            <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-600 font-bold text-2xl">Y</div>
          </div>
          <p className="text-sm"><strong className="font-bold">W</strong>는 단어에 포함되어 있고 올바른 위치에 있습니다.</p>
        </div>

        <div>
          <div className="flex gap-1 mb-2">
            <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-600 font-bold text-2xl">P</div>
            <div className="w-10 h-10 flex items-center justify-center bg-yellow-500 text-white border-yellow-500 font-bold text-2xl">I</div>
            <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-600 font-bold text-2xl">L</div>
            <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-600 font-bold text-2xl">L</div>
            <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-600 font-bold text-2xl">S</div>
          </div>
          <p className="text-sm"><strong className="font-bold">I</strong>는 단어에 포함되어 있지만 잘못된 위치에 있습니다.</p>
        </div>

        <div>
          <div className="flex gap-1 mb-2">
            <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-600 font-bold text-2xl">V</div>
            <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-600 font-bold text-2xl">A</div>
            <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-600 font-bold text-2xl">G</div>
            <div className="w-10 h-10 flex items-center justify-center bg-gray-700 text-white border-gray-700 font-bold text-2xl">U</div>
            <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-600 font-bold text-2xl">E</div>
          </div>
          <p className="text-sm"><strong className="font-bold">U</strong>는 단어에 포함되어 있지 않습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;