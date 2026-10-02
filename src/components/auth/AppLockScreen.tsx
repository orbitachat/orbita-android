import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { securityService } from '../../services/securityService';

interface AppLockScreenProps {
  onUnlocked: () => void;
}

export const AppLockScreen: React.FC<AppLockScreenProps> = ({ onUnlocked }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isBiometric = securityService.isBiometricEnabled();
  const isPassword = securityService.isPasswordSet();

  const triggerBiometric = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'REQUEST_BIOMETRIC_AUTH' })
      );
    }
  }, []);

  useEffect(() => {
    const handleSuccess = () => {
      onUnlocked();
    };
    const handleFailed = () => {
      setErrorMsg(t('appLock.biometric_failed', 'Не удалось подтвердить биометрию'));
    };

    window.addEventListener('orbita_biometric_success', handleSuccess);
    window.addEventListener('orbita_biometric_failed', handleFailed);

    if (isBiometric) {
      triggerBiometric();
    }

    return () => {
      window.removeEventListener('orbita_biometric_success', handleSuccess);
      window.removeEventListener('orbita_biometric_failed', handleFailed);
    };
  }, [isBiometric, onUnlocked, triggerBiometric, t]);

  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const isValid = await securityService.verifyPassword(password);
    setIsSubmitting(false);

    if (isValid) {
      onUnlocked();
    } else {
      setErrorMsg(t('appLock.wrong_password', 'Неверный пароль. Попробуйте еще раз.'));
      setPassword('');
    }
  };

  if (isBiometric || !isPassword) {
    return (
      <div
        className="fixed inset-0 z-[9998] flex flex-col justify-between items-center select-none bg-[#111216] text-white p-6"
        style={{
          paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="w-full flex justify-end">
          <button
            type="button"
            aria-label={t('common.more_options', 'Дополнительно')}
            className="p-2 text-[#8e929b] hover:text-white bg-transparent border-none outline-none cursor-pointer"
          >
            <MoreVertical size={22} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center justify-center my-auto"
        >
          <div className="mb-6 text-white flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white text-center tracking-tight m-0">
            {t('appLock.unlock_orbita', 'Разблокировать Orbita')}
          </h1>

          {errorMsg && (
            <p className="text-xs text-red-400 text-center font-medium mt-3 mb-0">
              {errorMsg}
            </p>
          )}
        </motion.div>

        <div className="w-full flex flex-col items-center">
          <p className="text-[13.5px] text-[#8e929b] text-center max-w-xs leading-relaxed mb-6">
            {t('appLock.biometric_android_desc', 'Используйте настройки блокировки вашего устройства Android, чтобы разблокировать Orbita.')}{' '}
            <span className="text-[#818cf8] font-medium cursor-pointer">
              {t('appLock.learn_more', 'Узнать больше')}
            </span>
          </p>

          <button
            type="button"
            onClick={triggerBiometric}
            aria-label={t('appLock.try_again', 'Попробовать ещё раз')}
            className="px-8 py-3.5 rounded-full font-semibold text-[15px] bg-[#343844] text-white hover:bg-[#3d4251] active:scale-95 transition-all border-none outline-none cursor-pointer"
          >
            {t('appLock.try_again', 'Попробовать ещё раз')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center select-none bg-[#111216] text-white p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center p-8 max-w-sm w-full relative z-10"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--surface-container)] flex items-center justify-center mb-6 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="36"
            height="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-white mb-6 text-center">
          {t('appLock.unlock_orbita', 'Разблокировать Orbita')}
        </h2>

        <form onSubmit={handleUnlock} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-base font-bold text-[var(--text-main)] text-left pl-1 mb-0.5">
              {t('appLock.enter_password_label', 'Введите пароль')}
            </label>
            <div className="relative flex items-center w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder={t('appLock.placeholder', 'Пароль')}
                autoFocus
                className="w-full px-1 py-2.5 outline-none text-sm transition-all pr-10"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${errorMsg ? '#ef4444' : 'var(--border-color, rgba(255,255,255,0.15))'}`,
                  borderRadius: '0px',
                  color: 'var(--text-main, #ffffff)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = errorMsg ? '#ef4444' : 'var(--accent-color, #7C3AED)')}
                onBlur={(e) => (e.currentTarget.style.borderBottomColor = errorMsg ? '#ef4444' : 'var(--border-color, rgba(255,255,255,0.15))')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? t('common.hide_password', 'Скрыть пароль') : t('common.show_password', 'Показать пароль')}
                className="absolute right-3 p-1 text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 text-center font-medium"
            >
              {errorMsg}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={!password || isSubmitting}
            aria-label={t('appLock.done_button', 'Готово')}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: '#ffffff',
              opacity: !password || isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
            <span>{t('appLock.done_button', 'Готово')}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
