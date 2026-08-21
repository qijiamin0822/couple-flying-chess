import { useEffect } from 'react';
import { Cherry, Flame } from 'lucide-react';

interface StartGameAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StartGameAlertModal({ isOpen, onClose }: StartGameAlertModalProps) {
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
            <Cherry className="text-white" size={26} />
            <Flame className="absolute -bottom-2 -right-3 text-[#FFD60A]" size={13} fill="currentColor" />
          </div>
        </div>

        <div className="mt-6 mb-3">
          <h2 className="text-2xl font-bold text-white">还差任务包</h2>
          <p className="text-sm text-gray-400 leading-relaxed mt-2">
            请先为双方选择任务包，把气氛装满再开始哦。
          </p>
        </div>

        <button
          className="mt-6 w-full h-12 rounded-full bg-gradient-to-r from-[#FFD60A] to-[#FF9F0A] text-black font-bold text-sm ios-btn shadow-[0_10px_30px_-8px_rgba(255,159,10,0.7)]"
          onClick={onClose}
        >
          知道了
        </button>
      </div>
    </div>
  );
}