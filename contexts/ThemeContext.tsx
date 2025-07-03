
import React, { createContext, useState, useContext, ReactNode, useLayoutEffect } from 'react';
import { ThemeName, themes } from '../styles/themes';

interface ThemeContextType {
    theme: ThemeName;
    setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeName>('default');

    useLayoutEffect(() => {
        const currentTheme = themes[theme];
        const root = document.documentElement;
        
        Object.keys(currentTheme.colors).forEach(key => {
            root.style.setProperty(key, currentTheme.colors[key]);
        });
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
