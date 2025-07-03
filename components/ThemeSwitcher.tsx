
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { themes, ThemeName } from '../styles/themes';
import { PaletteIcon } from './icons';

export const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { t } = useLanguage();

    return (
        <div>
            <label id="theme-label" className="block text-sm font-medium text-[var(--text)] mb-2">
                <PaletteIcon className="h-4 w-4 inline-block mr-1" />
                {t('theme')}
            </label>
            <div role="radiogroup" aria-labelledby="theme-label" className="flex items-center gap-2">
                {(Object.keys(themes) as ThemeName[]).map(themeKey => {
                    const current = themes[themeKey];
                    const isActive = theme === themeKey;
                    return (
                        <button
                            key={themeKey}
                            role="radio"
                            aria-checked={isActive}
                            aria-label={t(current.name as any) || current.name}
                            onClick={() => setTheme(themeKey)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-ring)] ${isActive ? 'border-[var(--primary)] scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: current.colors['--primary'] }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
