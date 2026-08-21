import { useEffect, useState, FormEvent } from 'react';
import { X, Check } from 'lucide-react';
import { Player } from '../../types';
import { AVATAR_OPTIONS } from '../../utils/coupleProfile';

interface PlayerProfileModalProps {
  isOpen: boolean;
  player: Player | null;
  onSave: (playerId: number, patch: Partial<Pick<Player, 'name' | 'avatar'>>) => void;
  onClose: () => void;
}

export function PlayerProfileModal({ isOpen, player, onSave, onClose }: PlayerProfileModalProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (player) {
      setName(player.name);
      setAvatar(player.avatar);
    }
  }, [player]);

  if (!isOpen || !player) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave(player.id, { name: name.trim() || player.name, avatar });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center overflow-y-auto no-scrollbar px-6 py-8 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md ios-glass rounded-[28px] border border-white/10 p-6 shadow-2xl modal-pop">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">编辑角色资料</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center ios-btn"
            aria-label="关闭"
          >
            <X className="text-white" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">角色名称</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={12}
              placeholder="输入角色名称"
              className="w-full h-12 rounded-2xl bg-[#2C2C2E] text-white px-4 outline-none border border-white/10 focus:border-[#FF375F]/60 ios-btn"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-3 block">选择头像</label>
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_OPTIONS.map(option => {
                const active = avatar === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setAvatar(option.id)}
                    className={`relative aspect-square rounded-2xl bg-white/5 border flex flex-col items-center justify-center gap-1 ios-btn transition-all ${
                      active
                        ? 'border-[#FF375F] bg-[#FF375F]/15 shadow-[0_8px_24px_-8px_rgba(255,55,95,0.7)]'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <span className="text-2xl leading-none">{option.emoji}</span>
                    <span className="text-[9px] text-gray-400">{option.label}</span>
                    {active && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF375F] flex items-center justify-center">
                        <Check className="text-white" size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="mt-1 w-full h-12 rounded-full bg-gradient-to-r from-[#FF2D55] to-[#FF9F0A] text-white font-bold text-sm ios-btn shadow-[0_10px_30px_-8px_rgba(255,45,85,0.7)]"
          >
            保存资料
          </button>
        </form>
      </div>
    </div>
  );
}
