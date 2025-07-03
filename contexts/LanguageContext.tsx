
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from '../i18n/locales';

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations['en'];

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey) => string;
    tTopic: (topic: string) => string;
    tDifficulty: (difficulty: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: TranslationKey): string => {
        return translations[language][key] || translations['en'][key] || key;
    };
    
    // These functions translate the specific enum values
    const tTopic = (topic: string): string => t(topic as TranslationKey);
    const tDifficulty = (difficulty: string): string => t(difficulty as TranslationKey);


    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, tTopic, tDifficulty }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
