
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Spinner: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[var(--accent)]"></div>
            <p className="text-lg font-semibold text-[var(--subtle-text)]">{t('generatingQuiz')}</p>
        </div>
    );
};

export default Spinner;