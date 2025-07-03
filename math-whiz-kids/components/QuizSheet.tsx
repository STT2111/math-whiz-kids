import React from 'react';
import { Settings, Exercise } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface QuizSheetProps {
  settings: Settings | null;
  exercises: Exercise[];
  includeAnswerKey: boolean;
}

const QuizSheet: React.ForwardRefRenderFunction<HTMLDivElement, QuizSheetProps> = ({ settings, exercises, includeAnswerKey }, ref) => {
    const { t, tTopic, tDifficulty } = useLanguage();
    const { theme } = useTheme();

    if (!settings || exercises.length === 0) return null;

    return (
        <div ref={ref} className="p-10 bg-[var(--surface)] text-[var(--text)]" data-theme={theme} style={{ width: '800px' }}>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-[var(--header)]">{t('pdfTitle')}</h1>
                <div className="flex justify-center gap-12 mt-3 text-base text-[var(--subtle-text)]">
                    <span><strong>{t('topic')}:</strong> {tTopic(settings.topic)}</span>
                    <span><strong>{t('difficulty')}:</strong> {tDifficulty(settings.difficulty)}</span>
                </div>
            </div>

            <h2 className="text-xl font-bold text-[var(--header)] border-b-2 border-[var(--surface-border)] pb-2 mb-6">{t('pdfQuizQuestions')}</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                {exercises.map((ex, index) => (
                    <div key={`question-${index}`} className="flex items-baseline gap-4 text-lg">
                        <span className="font-bold">{index + 1}.</span>
                        <span className="flex-grow tracking-wider">{ex.question}</span>
                        <span className="font-mono text-[var(--subtle-text)]">__________</span>
                    </div>
                ))}
            </div>

            {includeAnswerKey && (
                 <>
                    <div className="mt-10 pt-8 border-t-4 border-double border-[var(--surface-border)]"></div>
                    <h2 className="text-xl font-bold text-[var(--header)] border-b-2 border-[var(--surface-border)] pb-2 mb-6">{t('pdfAnswerKey')}</h2>
                    <div className="grid grid-cols-4 gap-x-8 gap-y-4 text-base">
                        {exercises.map((ex, index) => (
                            <div key={`answer-${index}`} className="flex gap-2">
                                <span className="font-bold">{index + 1}.</span>
                                <span>{ex.answer}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default React.forwardRef(QuizSheet);
