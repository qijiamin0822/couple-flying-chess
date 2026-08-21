import { FormEvent, useState } from 'react';
import { KeyRound, LockKeyhole, ShieldCheck, UnlockKeyhole } from 'lucide-react';

interface SettingsViewProps {
  hasPassword: boolean;
  onSavePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  onRemovePassword: (currentPassword: string) => Promise<boolean>;
  onLock: () => void;
}

export function SettingsView({
  hasPassword,
  onSavePassword,
  onRemovePassword,
  onLock
}: SettingsViewProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const clearForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 4) {
      setError('本地密码至少需要 4 位');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setSaving(true);
    const saved = await onSavePassword(currentPassword, newPassword);
    setSaving(false);

    if (!saved) {
      setError('当前密码不正确，无法修改本地密码');
      return;
    }

    clearForm();
    setMessage('本地密码已保存，下次打开应用时将需要解锁');
  };

  const handleRemove = async () => {
    setError('');
    setMessage('');
    setSaving(true);
    const removed = await onRemovePassword(currentPassword);
    setSaving(false);

    if (!removed) {
      setError('当前密码不正确，无法关闭密码保护');
      return;
    }

    clearForm();
    setMessage('本地密码保护已关闭');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto no-scrollbar pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-[#0A84FF]/15 border border-[#0A84FF]/20 flex items-center justify-center">
          <ShieldCheck className="text-[#64D2FF]" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">隐私设置</h2>
          <p className="text-xs text-gray-500 mt-1">保护本设备上的游戏记录和主题内容</p>
        </div>
      </div>

      <div className="ios-card p-5 border border-white/5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <KeyRound className="text-[#FFD60A]" size={20} />
          <div>
            <h3 className="text-base font-bold text-white">本地密码</h3>
            <p className="text-xs text-gray-500 mt-1">
              {hasPassword ? '已开启，应用锁定后需要密码解锁' : '未开启，设置后可保护本地隐私'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-3">
          {hasPassword && (
            <input
              type="password"
              value={currentPassword}
              onChange={event => setCurrentPassword(event.target.value)}
              placeholder="当前密码"
              className="w-full h-11 rounded-2xl bg-[#2C2C2E] text-white px-4 outline-none border border-white/10 focus:border-[#64D2FF]/60"
            />
          )}
          <input
            type="password"
            value={newPassword}
            onChange={event => setNewPassword(event.target.value)}
            placeholder={hasPassword ? '新密码（至少 4 位）' : '设置密码（至少 4 位）'}
            className="w-full h-11 rounded-2xl bg-[#2C2C2E] text-white px-4 outline-none border border-white/10 focus:border-[#64D2FF]/60"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
            placeholder="再次输入密码"
            className="w-full h-11 rounded-2xl bg-[#2C2C2E] text-white px-4 outline-none border border-white/10 focus:border-[#64D2FF]/60"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full h-11 rounded-full bg-gradient-to-r from-[#0A84FF] to-[#BF5AF2] text-white font-bold text-sm ios-btn disabled:opacity-50"
          >
            {hasPassword ? '更新本地密码' : '开启本地密码'}
          </button>
        </form>

        {error && <p className="text-sm text-[#FF453A] mt-3">{error}</p>}
        {message && <p className="text-sm text-emerald-400 mt-3">{message}</p>}
      </div>

      <div className="ios-card p-5 border border-white/5">
        <div className="flex items-center gap-3 mb-4">
          {hasPassword ? (
            <LockKeyhole className="text-[#64D2FF]" size={20} />
          ) : (
            <UnlockKeyhole className="text-gray-500" size={20} />
          )}
          <div>
            <h3 className="text-base font-bold text-white">应用锁定</h3>
            <p className="text-xs text-gray-500 mt-1">切换到后台后再次打开会要求解锁</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLock}
          disabled={!hasPassword || saving}
          className="w-full h-11 rounded-full bg-white/10 border border-white/10 text-white font-bold text-sm ios-btn disabled:opacity-40"
        >
          立即锁定应用
        </button>

        {hasPassword && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={saving || !currentPassword}
            className="w-full h-10 mt-3 rounded-full text-sm text-[#FF453A] border border-[#FF453A]/30 ios-btn disabled:opacity-40"
          >
            关闭密码保护
          </button>
        )}
      </div>
    </div>
  );
}
