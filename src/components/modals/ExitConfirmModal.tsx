import { useEffect } from 'react';
import { Heart, Flame, Save, Gamepad2 } from 'lucide-react';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExitConfirmModal({ isOpen, onClose, onConfirm }: ExitConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto no-scrollbar px-6 py-6">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md animate-modal-fade" onClick={onClose} />

      <div className="relative w-full max-w-sm ios-glass rounded-[28px] border border-white/10 p-7 text-center shadow-2xl modal-pop">
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-[#FF2D55] via-[#FF375F] to-[#FF9F0A] flex items-center justify-center shadow-[0_12px_30px_-6px_rgba(255,45,85,0.8)]">
          <div className="relative">
            <Heart className="text-white heart-throb" size={26} fill="currentColor" />
            <Flame className="absolute -bottom-2 -right-3 text-[#FFD60A]" size={13} fill="currentColor" />
          </div>
        </div>

        <div className="mt-6 mb-3">
          <h2 className="text-2xl font-bold text-white">确认离开游戏？</h2>
          <p className="text-sm text-gray-400 leading-relaxed mt-2">
            当前进度会保存，回到主页后可以继续这局。
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 h-12 rounded-full bg-white text-black font-bold text-sm ios-btn flex items-center justify-center gap-2 shadow-lg"
            onClick={onClose}
          >
            <Gamepad2 size={17} />
            继续游戏
          </button>
          <button
            className="flex-1 h-12 rounded-full bg-[#3A3A3C]/80 text-[#FF453A] font-bold text-sm ios-btn flex items-center justify-center gap-2 border border-[#FF453A]/25"
            onClick={onConfirm}
          >
            <Save size={17} />
            暂存退出
          </button>
        </div>
      </div>
    </div>
  );
}
