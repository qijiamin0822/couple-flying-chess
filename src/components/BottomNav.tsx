import { BarChart3, GamepadIcon, Layers, Settings } from 'lucide-react';

interface BottomNavProps {
  activeView: 'home' | 'game' | 'themes' | 'stats' | 'settings';
  onNavigate: (view: 'home' | 'themes' | 'stats' | 'settings') => void;
}

export function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  return (
    <nav className="h-[84px] ios-glass border-t border-white/5 flex items-start justify-around pt-3 shrink-0 z-50">
      <button
        className={`group flex flex-col items-center gap-1 w-16 transition-opacity ${
          activeView === 'home' || activeView === 'game' ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => onNavigate('home')}
      >
        <GamepadIcon
          className={`transition-colors ${
            activeView === 'home' || activeView === 'game'
              ? 'text-white'
              : 'text-gray-400 group-hover:text-white'
          }`}
          size={26}
        />
        <span
          className={`text-[10px] font-medium transition-colors ${
            activeView === 'home' || activeView === 'game'
              ? 'text-white'
              : 'text-gray-400 group-hover:text-white'
          }`}
        >
          游戏
        </span>
      </button>

      <button
        className={`group flex flex-col items-center gap-1 w-16 transition-opacity ${
          activeView === 'stats' ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => onNavigate('stats')}
      >
        <BarChart3
          className={`transition-colors ${
            activeView === 'stats'
              ? 'text-white'
              : 'text-gray-400 group-hover:text-white'
          }`}
          size={26}
        />
        <span
          className={`text-[10px] font-medium transition-colors ${
            activeView === 'stats'
              ? 'text-white'
              : 'text-gray-400 group-hover:text-white'
          }`}
        >
          战绩
        </span>
      </button>

      <button
        className={`group flex flex-col items-center gap-1 w-16 transition-opacity ${
          activeView === 'settings' ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => onNavigate('settings')}
      >
        <Settings
          className={`transition-colors ${
            activeView === 'settings'
              ? 'text-white'
              : 'text-gray-400 group-hover:text-white'
          }`}
          size={26}
        />
        <span
          className={`text-[10px] font-medium transition-colors ${
            activeView === 'settings'
              ? 'text-white'
              : 'text-gray-400 group-hover:text-white'
          }`}
        >
          设置
        </span>
      </button>

      <button
        className={`group flex flex-col items-center gap-1 w-16 transition-opacity ${
          activeView === 'themes' ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => onNavigate('themes')}
      >
        <Layers
          className={`transition-colors ${
            activeView === 'themes'
              ? 'text-white'
              : 'text-gray-400 group-hover:text-white'
          }`}
          size={26}
        />
        <span
          className={`text-[10px] font-medium transition-colors ${
            activeView === 'themes'
              ? 'text-white'
              : 'text-gray-400 group-hover:text-white'
          }`}
        >
          题库
        </span>
      </button>
    </nav>
  );
}
