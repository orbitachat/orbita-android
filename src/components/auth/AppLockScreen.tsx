import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Fingerprint } from 'lucide-react';
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

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center select-none"
      style={{
        backgroundColor: 'var(--bg-primary, #121212)',
        color: 'var(--text-main, #ffffff)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center p-8 max-w-sm w-full relative z-10"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--surface-container)] flex items-center justify-center mb-6 text-[var(--accent-color)]">
          <Fingerprint size={36} />
        </div>

        {isPassword ? (
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

            {isBiometric && (
              <button
                type="button"
                onClick={triggerBiometric}
                aria-label={t('appLock.biometric_prompt', 'Сканировать отпечаток')}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 border border-[var(--border-color)] bg-[var(--surface-container)] text-[var(--text-main)] hover:bg-[var(--surface-container-strong)]"
              >
                <Fingerprint size={20} className="text-[var(--accent-color)]" />
                <span>{t('appLock.biometric_prompt', 'Сканировать отпечаток')}</span>
              </button>
            )}
          </form>
        ) : (
          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-sm text-[var(--text-dim)] text-center">
              {t('appLock.biometric_scan_desc', 'Приложение заблокировано. Подтвердите вход по отпечатку пальца.')}
            </p>
            {errorMsg && (
              <p className="text-xs text-red-400 text-center font-medium">
                {errorMsg}
              </p>
            )}
            <button
              type="button"
              onClick={triggerBiometric}
              aria-label={t('appLock.biometric_prompt', 'Сканировать отпечаток')}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 bg-[var(--accent-color)] text-white shadow-lg active:scale-95"
            >
              <Fingerprint size={22} />
              <span>{t('appLock.biometric_prompt', 'Сканировать отпечаток')}</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
