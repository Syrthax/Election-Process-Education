import { useI18n } from '../i18n/I18nContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, switchLanguage } = useI18n();

  return (
    <button
      onClick={() => switchLanguage(language === 'en' ? 'hi' : 'en')}
      aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
      title={language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 8,
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        cursor: 'pointer',
        color: 'var(--color-primary-light)',
        fontSize: '0.8rem',
        fontWeight: 600,
        fontFamily: 'inherit',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      <Globe size={14} />
      {language === 'en' ? 'हिंदी' : 'ENG'}
    </button>
  );
}
