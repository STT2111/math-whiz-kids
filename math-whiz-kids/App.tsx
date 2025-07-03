import React, { useState, useCallback, useRef } from 'react';
import { Settings, Exercise, UserAnswer, Status } from './types';
import { generateExercises } from './services/geminiService';
import { generateQuizPdf } from './services/pdfService';
import { generateQuizImage } from './services/imageService';
import SettingsForm from './components/SettingsForm';
import ExerciseCard from './components/ExerciseCard';
import ScoreDisplay from './components/ScoreDisplay';
import Spinner from './components/Spinner';
import QuizSheet from './components/QuizSheet';
import { DownloadIcon, PhotoIcon, CogIcon, XMarkIcon } from './components/icons';
import { useLanguage, Language } from './contexts/LanguageContext';
import { translations } from './i18n/locales';
import { ThemeSwitcher } from './components/ThemeSwitcher';


const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    
    return (
        <div>
            <label htmlFor="language-select" className="block text-sm font-medium text-[var(--text)] mb-2">{t('language')}</label>
            <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full bg-[var(--surface)] border border-[var(--surface-border)] rounded-md shadow-sm px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-ring)]"
                aria-label={t('languageAriaLabel')}
            >
                {(Object.keys(translations) as Language[]).map(lang => (
                    <option key={lang} value={lang}>
                        {translations[lang][lang as 'en' | 'km']}
                    </option>
                ))}
            </select>
        </div>
    );
};

const App: React.FC = () => {
    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [userAnswers, setUserAnswers] = useState<UserAnswer>({});
    const [score, setScore] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [includeAnswerKey, setIncludeAnswerKey] = useState<boolean>(true);
    
    const quizSheetRef = useRef<HTMLDivElement>(null);
    const { language, t, tTopic, tDifficulty } = useLanguage();

    const handleGenerate = async (newSettings: Settings) => {
        setStatus(Status.LOADING);
        setSettings(newSettings);
        setError(null);
        setExercises([]);
        setUserAnswers({});
        try {
            const newExercises = await generateExercises(newSettings, language);
            setExercises(newExercises);
            setStatus(Status.READY);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setStatus(Status.ERROR);
        }
    };

    const handleAnswerChange = (index: number, value: string) => {
        setUserAnswers(prev => ({ ...prev, [index]: value }));
    };

    const handleCheckAnswers = () => {
        let currentScore = 0;
        exercises.forEach((exercise, index) => {
            if (parseInt(userAnswers[index], 10) === exercise.answer) {
                currentScore++;
            }
        });
        setScore(currentScore);
        setStatus(Status.CHECKED);
    };

    const handleReset = () => {
        setStatus(Status.IDLE);
        setSettings(null);
        setExercises([]);
        setUserAnswers({});
        setScore(0);
        setError(null);
    };
    
    const handleDownloadPdf = useCallback(() => {
        if (settings && exercises.length > 0) {
            const pdfTranslations = {
                title: t('pdfTitle'),
                topicLabel: t('topic'),
                difficultyLabel: t('difficulty'),
                quizQuestions: t('pdfQuizQuestions'),
                answerKey: t('pdfAnswerKey'),
            };
            const translatedTopic = tTopic(settings.topic);
            const translatedDifficulty = tDifficulty(settings.difficulty);
            generateQuizPdf(settings, exercises, pdfTranslations, translatedTopic, translatedDifficulty, includeAnswerKey);
        }
    }, [settings, exercises, language, t, tTopic, tDifficulty, includeAnswerKey]);
    
    const handleDownloadImage = useCallback(() => {
        if (quizSheetRef.current && settings) {
            const fileName = `Math-Quiz-${settings.topic.replace(' ', '-')}-${settings.difficulty}`;
            generateQuizImage(quizSheetRef.current, fileName);
        }
    }, [settings, includeAnswerKey]);


    const renderContent = () => {
        switch (status) {
            case Status.LOADING:
                return <Spinner />;
            case Status.ERROR:
                return (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                        <p className="font-bold">{t('errorTitle')}</p>
                        <p>{error}</p>
                        <button onClick={handleReset} className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">{t('tryAgain')}</button>
                    </div>
                );
            case Status.READY:
            case Status.CHECKED:
                return (
                    <div className="space-y-4">
                        {status === Status.CHECKED && (
                           <ScoreDisplay
                                score={score}
                                total={exercises.length}
                                onReset={handleReset}
                                onDownload={handleDownloadPdf}
                                onDownloadImage={handleDownloadImage}
                                includeAnswerKey={includeAnswerKey}
                                onIncludeAnswerKeyChange={setIncludeAnswerKey}
                           />
                        )}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {exercises.map((ex, index) => (
                                <ExerciseCard
                                    key={index}
                                    index={index}
                                    question={ex.question}
                                    userAnswer={userAnswers[index] || ''}
                                    onAnswerChange={handleAnswerChange}
                                    isCorrect={status === Status.CHECKED ? parseInt(userAnswers[index], 10) === ex.answer : null}
                                    isSubmitted={status === Status.CHECKED}
                                />
                            ))}
                        </div>
                        {status === Status.READY && exercises.length > 0 && (
                            <div>
                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        onClick={handleCheckAnswers}
                                        className="w-full bg-[var(--primary)] text-[var(--primary-text)] font-bold py-3 px-4 rounded-lg shadow-md hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-transform transform hover:scale-105"
                                    >
                                        {t('checkAnswers')}
                                    </button>
                                    <button
                                        onClick={handleDownloadPdf}
                                        aria-label={t('downloadPdf')}
                                        className="flex-shrink-0 bg-[var(--secondary)] text-[var(--secondary-text)] p-3 rounded-lg shadow-md hover:bg-[var(--secondary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] transition-transform transform hover:scale-105"
                                    >
                                        <DownloadIcon className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={handleDownloadImage}
                                        aria-label={t('downloadImage')}
                                        className="flex-shrink-0 bg-[var(--secondary)] text-[var(--secondary-text)] p-3 rounded-lg shadow-md hover:bg-[var(--secondary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] transition-transform transform hover:scale-105"
                                    >
                                        <PhotoIcon className="h-6 w-6" />
                                    </button>
                                </div>
                                <div className="mt-2 pr-1 text-right">
                                   <label className="inline-flex items-center gap-2 text-sm text-[var(--subtle-text)] cursor-pointer select-none">
                                       <input
                                           type="checkbox"
                                           checked={includeAnswerKey}
                                           onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                                           className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                                       />
                                       {t('includeAnswerKey')}
                                   </label>
                               </div>
                           </div>
                        )}
                    </div>
                );
            case Status.IDLE:
            default:
                return (
                    <div className="text-center p-8 bg-[var(--surface)] rounded-xl shadow-lg border border-[var(--surface-border)]">
                        <h2 className="text-2xl font-bold text-[var(--text)]">{t('welcomeTitle')}</h2>
                        <p className="mt-2 text-[var(--subtle-text)]">{t('welcomeSubtitle')}</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--bg-start)] to-[var(--bg-end)] py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                 <button
                    onClick={() => setIsSettingsOpen(prev => !prev)}
                    className="p-3 bg-[var(--surface)] rounded-full shadow-lg border border-[var(--surface-border)] text-[var(--text)] hover:bg-[var(--surface-border)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-ring)] transition-all"
                    aria-label={isSettingsOpen ? t('closeSettings') : t('openSettings')}
                    aria-expanded={isSettingsOpen}
                    aria-controls="settings-panel"
                >
                    {isSettingsOpen ? <XMarkIcon className="h-6 w-6" /> : <CogIcon className="h-6 w-6" />}
                </button>
                
                {isSettingsOpen && (
                    <div
                        id="settings-panel"
                        className="bg-[var(--surface)] p-4 rounded-lg shadow-lg border border-[var(--surface-border)] flex flex-col gap-4 w-52 origin-top-right"
                        style={{ animation: 'fadeInUp 0.2s ease-out forwards' }}
                    >
                        <LanguageSwitcher />
                        <ThemeSwitcher />
                    </div>
                )}
            </div>
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="text-center pt-8 sm:pt-0">
                    <h1 className="text-4xl sm:text-5xl font-black text-[var(--header)] tracking-tight">{t('headerTitle')} <span className="text-[var(--accent)]">{t('headerTitleSpan')}</span></h1>
                    <p className="mt-2 text-lg text-[var(--subtle-text)]">{t('headerSubtitle')}</p>
                </header>

                <main className="space-y-8">
                    {status !== Status.CHECKED && <SettingsForm onGenerate={handleGenerate} isLoading={status === Status.LOADING} />}
                    {renderContent()}
                </main>
            </div>
            <div className="absolute -left-[9999px] top-0" aria-hidden="true">
                <QuizSheet ref={quizSheetRef} settings={settings} exercises={exercises} includeAnswerKey={includeAnswerKey} />
            </div>
        </div>
    );
};

export default App;