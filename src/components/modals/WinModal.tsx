import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { MatchReport } from '../../types';
import { formatDuration } from '../../utils/coupleProfile';

interface WinModalProps {
  isOpen: boolean;
  winnerName: string;
  winnerAvatar: string;
  report: MatchReport | null;
  onRestart: () => void;
}

export function WinModal({ isOpen, winnerName, winnerAvatar, report, onRestart }: WinModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!report) return;
    const text = [
      '【情侣飞行棋 · 今晚战报】',
      `胜者：${report.winnerName}`,
      `对手：${report.loserName}`,
      `回合数：${report.turns}`,
      `完成任务：${report.completedTasks}`,
      `拒绝任务：${report.rejectedTasks}`,
      `主题包：${report.themeNames.join('、') || '未选择'}`,
      `用时：${formatDuration(report.durationSeconds)}`,
      `亲密值：+${report.intimacyEarned}`
    ].join('\n');

    const fallbackCopy = () => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy();
      }
    } catch {
      fallbackCopy();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto no-scrollbar px-4 py-6 bg-black/95">
      <div className="w-full max-w-md text-center my-auto">
        <div className="text-6xl mb-3">
          <span className="block">{winnerAvatar}</span>
          <span className="text-3xl">👑</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-2">{winnerName}</h2>
        <p className="text-gray-400 mb-6">今晚你是赢家</p>

        <div className="ios-glass rounded-[28px] border border-white/10 p-5 mb-6 text-left modal-pop">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white/5 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-white">{report?.turns ?? 0}</div>
              <div className="text-[10px] text-gray-500 mt-1">回合</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-emerald-300">{report?.completedTasks ?? 0}</div>
              <div className="text-[10px] text-gray-500 mt-1">完成</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-[#FF453A]">{report?.rejectedTasks ?? 0}</div>
              <div className="text-[10px] text-gray-500 mt-1">拒绝</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
            <span>用时 {report ? formatDuration(report.durationSeconds) : '00:00'}</span>
            <span>亲密值 +{report?.intimacyEarned ?? 0}</span>
          </div>

          <div className="text-xs text-gray-500 leading-relaxed mb-5">
            主题包：{report?.themeNames.join('、') || '未选择'}
          </div>

          <button
            onClick={handleCopy}
            className="w-full h-11 rounded-full bg-white/10 text-white text-sm font-bold ios-btn border border-white/10 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="text-emerald-400" size={16} />
                战报已复制
              </>
            ) : (
              <>
                <Copy size={16} />
                复制今晚战报
              </>
            )}
          </button>
        </div>

        <button
          className="px-10 py-4 bg-white text-black font-bold text-lg rounded-full ios-btn"
          onClick={onRestart}
        >
          再来一局
        </button>
      </div>
    </div>
  );
}
