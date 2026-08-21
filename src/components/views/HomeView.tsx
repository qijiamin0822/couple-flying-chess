import { Player, Theme } from '../../types';
import { Check, ChevronRight, Heart, Pencil, Sparkles } from 'lucide-react';
import { getAvatarEmoji } from '../../utils/coupleProfile';

interface HomeViewProps {
  players: Player[];
  themes: Theme[];
  onSelectTheme: (playerId: number) => void;
  onEditProfile: (playerId: number) => void;
  onStartGame: () => void;
  hasInProgressGame: boolean;
  onResumeGame: () => void;
}

export function HomeView({
  players,
  themes,
  onSelectTheme,
  onEditProfile,
  onStartGame,
  hasInProgressGame,
  onResumeGame
}: HomeViewProps) {
  return (
    <div className="flex-1 flex flex-col justify-start space-y-8 mt-10">
      <div className="text-center mb-4">
        <h2 className="text-xl text-gray-300 font-medium">配置游戏角色</h2>
        <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1.5"><Heart className="text-[#FF375F]" size={14} fill="currentColor" />选择双方的任务主题包</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {players.map(player => {
          const theme = themes.find(t => t.id === player.themeId);
          return (
            <div
              key={player.id}
              className="ios-card p-5 flex items-center justify-between ios-btn cursor-pointer group border border-white/5"
              onClick={() => onSelectTheme(player.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg border border-white/10"
                  style={{
                    backgroundColor: player.color,
                    boxShadow: `0 10px 15px -3px ${player.color}30`
                  }}
                >
                  {getAvatarEmoji(player.avatar, player.role)}
                </div>
                <div>
                  <div className="text-base font-semibold text-white">
                    {player.name} (Player {player.id + 1})
                  </div>
                  <div className="text-sm font-medium text-white mt-0.5">
                    {theme?.name || '未选择主题'}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ios-btn"
                  onClick={e => {
                    e.stopPropagation();
                    onEditProfile(player.id);
                  }}
                  aria-label="编辑角色"
                >
                  <Pencil className="text-white" size={15} />
                </button>
                {theme ? (
                <div className="flex items-center gap-2">
                  <span className="bg-white/10 px-2 py-1 rounded-full text-[10px] text-gray-300">
                    {theme.tasks.length}卡
                  </span>
                  <div className="w-7 h-7 rounded-full bg-emerald-400/20 flex items-center justify-center">
                    <Check className="text-emerald-300" size={16} />
                  </div>
                </div>
                ) : (
                  <ChevronRight className="text-gray-600" size={20} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-1" />

      {hasInProgressGame ? (
        <div className="flex flex-col gap-3 mb-8">
          <button
            className="relative w-full h-14 rounded-full text-black font-bold text-lg shadow-[0_10px_35px_-8px_rgba(255,55,95,0.65)] ios-btn flex items-center justify-center gap-2 overflow-hidden bg-gradient-to-r from-[#FFD60A] via-white to-[#FF375F]"
            onClick={onResumeGame}
          >
            <span>继续上次对局</span>
            <ChevronRight size={20} />
          </button>
          <button
            className="w-full h-11 rounded-full bg-white/5 text-gray-400 text-sm font-semibold ios-btn border border-white/10"
            onClick={onStartGame}
          >
            重新开始新对局
          </button>
        </div>
      ) : (
        <button
          className="relative w-full h-14 rounded-full text-black font-bold text-lg shadow-[0_10px_35px_-8px_rgba(255,55,95,0.65)] ios-btn flex items-center justify-center gap-2 mb-8 overflow-hidden bg-gradient-to-r from-[#FFD60A] via-white to-[#FF375F]"
          onClick={onStartGame}
        >
          <span>开始游戏</span>
          <Sparkles className="text-[#FF375F]" size={18} /><ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
