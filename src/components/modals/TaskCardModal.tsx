import { useState, useEffect, useRef } from 'react';
import { TaskEventData } from '../../types';
import { Check, Heart, Lock, HandshakeIcon, X } from 'lucide-react';

interface TaskCardModalProps {
  isOpen: boolean;
  taskData: TaskEventData | null;
  onAccept: () => void;
  onReject: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  favorite: <Heart size={40} fill="currentColor" />,
  lock: <Lock size={40} />,
  handshake: <HandshakeIcon size={40} />
};

export function TaskCardModal({ isOpen, taskData, onAccept, onReject }: TaskCardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [result, setResult] = useState<'accept' | 'reject' | null>(null);
  const resultTimer = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsFlipped(false);
      setResult(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (resultTimer.current !== null) {
        window.clearTimeout(resultTimer.current);
      }
    };
  }, []);

  if (!isOpen || !taskData) return null;

  const rejectLabel = taskData.type === 'collision' ? '拒绝（回到起点）' : '拒绝（倒退1~3格）';
  const executorLabel = taskData.executorPlayerId === 0 ? '男方' : '女方';
  const executorClassName = taskData.executorPlayerId === 0 ? 'text-[#0A84FF]' : 'text-[#FF375F]';

  const handleOutcome = (outcome: 'accept' | 'reject') => {
    if (result) return;
    setResult(outcome);
    resultTimer.current = window.setTimeout(() => {
      if (outcome === 'accept') {
        onAccept();
      } else {
        onReject();
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[110] flex overflow-y-auto no-scrollbar px-4 sm:px-6 py-6 animate-modal-fade">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div className="task-card-enter relative w-full max-w-sm h-[min(560px,calc(100vh-2rem))] my-auto shrink-0 perspective-1000">
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          <div
            className="flip-card-front bg-[#1C1C1E] border border-white/10 p-6 flex flex-col items-center justify-center shadow-2xl cursor-pointer"
            onClick={() => setIsFlipped(true)}
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
              <div className={taskData.color}>
                {iconMap[taskData.icon] || iconMap.favorite}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{taskData.title}</h3>
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-8">
              点击翻转查看任务
            </p>
           
          </div>

          <div className="flip-card-back bg-[#1C1C1E] border border-white/10 p-6 shadow-2xl overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 overflow-y-auto no-scrollbar">
              <div className={taskData.color}>
                {iconMap[taskData.icon] || iconMap.favorite}
              </div>
              <h3 className="text-xl font-bold text-white mb-6 mt-4">{taskData.title}</h3>
              <div className="text-xs text-gray-400 text-center leading-relaxed mb-6">
                <div>{taskData.subtitle}</div>
                <div>
                  由 <span className={executorClassName}>{executorLabel}</span> 执行
                </div>
              </div>

              <div className="w-full bg-[#2C2C2E] rounded-xl p-6 min-h-[120px] flex items-center justify-center border border-white/5 mb-6">
                <p className="text-lg font-medium text-white text-center leading-relaxed">
                  {taskData.task}
                </p>
              </div>
            </div>

            <div className="w-full flex gap-3 mt-4 shrink-0">
              <button
                className="flex-1 h-12 rounded-full bg-[#3A3A3C] text-[#FF453A] font-bold text-sm ios-btn border border-transparent hover:border-[#FF453A]/30"
                onClick={() => handleOutcome('reject')}
              >
                {rejectLabel}
              </button>
              <button
                className="flex-1 h-12 rounded-full bg-white text-black font-bold text-sm ios-btn shadow-lg"
                onClick={() => handleOutcome('accept')}
              >
                接受任务
              </button>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="fixed inset-0 z-[115] flex items-center justify-center bg-black/70 backdrop-blur-md animate-modal-fade">
          <div className={`w-full max-w-[260px] rounded-[32px] border p-8 text-center shadow-2xl modal-pop ${
            result === 'accept'
              ? 'bg-[#1C1C1E] border-emerald-400/30'
              : 'bg-[#1C1C1E] border-[#FF453A]/30'
          }`}>
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              result === 'accept' ? 'bg-emerald-400/20' : 'bg-[#FF453A]/20'
            }`}>
              {result === 'accept' ? (
                <Check className="text-emerald-400" size={32} />
              ) : (
                <X className="text-[#FF453A]" size={32} />
              )}
            </div>
            <h3 className="text-xl font-bold text-white">
              {result === 'accept' ? '任务完成' : '任务拒绝'}
            </h3>
            <p className="text-sm text-gray-400 mt-2">
              {result === 'accept' ? '本轮战绩 +10' : rejectLabel}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
