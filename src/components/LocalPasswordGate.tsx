import { FormEvent, useState } from 'react';
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from 'lucide-react';

interface LocalPasswordGateProps {
  onUnlock: (password: string) => Promise<boolean>;
}

export function LocalPasswordGate({ onUnlock }: LocalPasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (checking || !password) return;

    setChecking(true);
    setError('');
    const unlocked = await onUnlock(password);
    setChecking(false);

    if (!unlocked) {
      setPassword('');
      setError('密码不正确，请再试一次');
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center overflow-y-auto no-scrollbar px-6 py-6 bg-[radial-gradient(circle_at_top_right,_rgba(10,132,255,0.22),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(191,90,242,0.16),_transparent_36%),linear-gradient(135deg,#090B18_0%,#000000_60%,#12091A_100%)]">
      <div className="relative w-full max-w-sm ios-glass rounded-[28px] border border-white/10 p-7 text-center shadow-2xl modal-pop">
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#BF5AF2] flex items-center justify-center shadow-[0_12px_30px_-6px_rgba(10,132,255,0.7)]">
          <ShieldCheck className="text-white" size={25} />
        </div>

        <div className="mt-6 mb-5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 mb-4">
            <KeyRound className="text-[#64D2FF]" size={26} />
          </div>
          <h1 className="text-2xl font-bold text-white">应用已锁定</h1>
          <p className="text-sm text-gray-400 leading-relaxed mt-2">
            输入本地密码后继续使用情侣飞行棋。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={event => {
                setPassword(event.target.value);
                setError('');
              }}
              placeholder="请输入本地密码"
              className="w-full h-12 rounded-full bg-[#2C2C2E] text-white text-center text-lg tracking-[0.25em] outline-none border border-white/10 focus:border-[#64D2FF]/60 ios-btn"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(value => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white ios-btn"
              aria-label={showPassword ? '隐藏密码' : '显示密码'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-sm text-[#FF453A]">{error}</p>}

          <button
            type="submit"
            disabled={checking || !password}
            className="mt-1 w-full h-12 rounded-full bg-gradient-to-r from-[#0A84FF] to-[#BF5AF2] text-white font-bold text-sm ios-btn shadow-[0_10px_30px_-8px_rgba(10,132,255,0.7)] disabled:opacity-50"
          >
            {checking ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                校验中...
              </span>
            ) : (
              '解锁应用'
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 leading-relaxed mt-5">
          密码仅保存在本设备。忘记密码时，需要在系统设置中清除应用数据。
        </p>
      </div>
    </div>
  );
}
