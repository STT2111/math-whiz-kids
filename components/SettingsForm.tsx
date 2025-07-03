
import React, { useState } from 'react';
import { Settings, Topic, Difficulty } from '../types';
import { TOPICS, DIFFICULTY_LEVELS } from '../constants';
import { SparklesIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsFormProps {
    onGenerate: (settings: Settings) => void;
    isLoading: boolean;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onGenerate, isLoading }) => {
    const [settings, setSettings] = useState<Settings>({
        topic: Topic.ADDITION,
        difficulty: Difficulty.EASY,
        count: 10
    });
    
    const { t, tTopic, tDifficulty } = useLanguage();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(settings);
    };

    const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const count = Math.max(1, Math.min(20, Number(e.target.value)));
        setSettings(prev => ({ ...prev, count }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[var(--surface)] p-6 rounded-xl shadow-lg border border-[var(--surface-border)] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="topic" className="block text-sm font-bold text-[var(--text)] mb-2">{t('topic')}</label>
                    <select
                        id="topic"
                        value={settings.topic}
                        onChange={(e) => setSettings(prev => ({ ...prev, topic: e.target.value as Topic }))}
                        className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] text-black"
                        disabled={isLoading}
                    >
                        {TOPICS.map(topic => <option key={topic} value={topic}>{tTopic(topic)}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="difficulty" className="block text-sm font-bold text-[var(--text)] mb-2">{t('difficulty')}</label>
                    <select
                        id="difficulty"
                        value={settings.difficulty}
                        onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value as Difficulty }))}
                        className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] text-black"
                        disabled={isLoading}
                    >
                        {DIFFICULTY_LEVELS.map(level => <option key={level} value={level}>{tDifficulty(level)}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="count" className="block text-sm font-bold text-[var(--text)] mb-2">{t('numQuestions')}</label>
                    <input
                        type="number"
                        id="count"
                        value={settings.count}
                        onChange={handleCountChange}
                        min="1"
                        max="20"
                        className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] text-black"
                        disabled={isLoading}
                    />
                </div>
            </div>
            <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[var(--generate-bg)] text-[var(--generate-text)] font-bold py-3 px-4 rounded-lg shadow-md hover:bg-[var(--generate-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--generate-bg)] transition-transform transform hover:scale-105 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
            >
                <SparklesIcon className="h-5 w-5"/>
                <span>{isLoading ? t('generating') : t('createQuiz')}</span>
            </button>
        </form>
    );
};

export default SettingsForm;