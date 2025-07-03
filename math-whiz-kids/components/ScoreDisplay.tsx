import React from 'react';
import { DownloadIcon, PhotoIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface ScoreDisplayProps {
    score: number;
    total: number;
    onReset: () => void;
    onDownload: () => void;
    onDownloadImage: () => void;
    includeAnswerKey: boolean;
    onIncludeAnswerKeyChange: (checked: boolean) => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, total, onReset, onDownload, onDownloadImage, includeAnswerKey, onIncludeAnswerKeyChange }) => {
    const { t } = useLanguage();
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    
    let messageKey: 'scoreMessagePerfect' | 'scoreMessageExcellent' | 'scoreMessageGood' | 'scoreMessageEffort' = 'scoreMessageEffort';
    if (percentage === 100) {
        messageKey = "scoreMessagePerfect";
    } else if (percentage >= 80) {
        messageKey = "scoreMessageExcellent";
    } else if (percentage >= 50) {
        messageKey = "scoreMessageGood";
    }

    return (
        <div className="bg-[var(--surface)] p-6 rounded-xl shadow-lg border border-[var(--surface-border)] text-center space-y-4">
            <h2 className="text-2xl font-bold text-[var(--header)]">{t('quizComplete')}</h2>
            <p className="text-4xl font-black text-[var(--accent)]">
                {score} / {total}
            </p>
            <p className="text-lg font-semibold text-[var(--subtle-text)]">{t(messageKey)}</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
                 <button
                    onClick={onReset}
                    className="w-full sm:w-auto bg-[var(--primary)] text-[var(--primary-text)] font-bold py-2 px-6 rounded-lg shadow-md hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-transform transform hover:scale-105"
                >
                    {t('createNewQuiz')}
                </button>
                <button
                    onClick={onDownload}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--secondary)] text-[var(--secondary-text)] font-bold py-2 px-6 rounded-lg shadow-md hover:bg-[var(--secondary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] transition-transform transform hover:scale-105"
                >
                    <DownloadIcon className="h-5 w-5" />
                    <span>{t('downloadPdf')}</span>
                </button>
                <button
                    onClick={onDownloadImage}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--secondary)] text-[var(--secondary-text)] font-bold py-2 px-6 rounded-lg shadow-md hover:bg-[var(--secondary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] transition-transform transform hover:scale-105"
                >
                    <PhotoIcon className="h-5 w-5" />
                    <span>{t('downloadImage')}</span>
                </button>
            </div>
             <div className="mt-2">
                <label className="flex items-center justify-center gap-2 text-sm text-[var(--subtle-text)] cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={includeAnswerKey}
                        onChange={(e) => onIncludeAnswerKeyChange(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    {t('includeAnswerKey')}
                </label>
            </div>
        </div>
    );
};

export default ScoreDisplay;