
export type ThemeName = 'default' | 'forest' | 'ocean' | 'sunset';

export interface Theme {
    name: string;
    colors: Record<string, string>;
}

export const themes: Record<ThemeName, Theme> = {
    default: {
        name: 'Default',
        colors: {
            '--primary': '#2563eb', // blue-600
            '--primary-hover': '#1d4ed8', // blue-700
            '--primary-text': '#ffffff',
            '--secondary': '#9ca3af', // gray-400
            '--secondary-hover': '#6b7280', // gray-500
            '--secondary-text': '#1f2937', // gray-800
            '--accent': '#f59e0b', // amber-500
            '--bg-start': '#eff6ff', // blue-50
            '--bg-end': '#e0f2fe', // sky-100
            '--header': '#1e3a8a', // blue-900
            '--text': '#374151', // gray-700
            '--subtle-text': '#6b7280', // gray-500
            '--surface': '#ffffff',
            '--surface-border': '#e5e7eb', // gray-200
            '--focus-ring': '#60a5fa', // blue-400
            '--generate-bg': '#f59e0b', // amber-500
            '--generate-text': '#78350f', // amber-900
            '--generate-hover': '#facc15', // yellow-400
        }
    },
    forest: {
        name: 'Forest',
        colors: {
            '--primary': '#16a34a', // green-600
            '--primary-hover': '#15803d', // green-700
            '--primary-text': '#ffffff',
            '--secondary': '#78350f', // amber-900
            '--secondary-hover': '#451a03', // amber-950
            '--secondary-text': '#ffffff',
            '--accent': '#f97316', // orange-500
            '--bg-start': '#f0fdf4', // green-50
            '--bg-end': '#fef3c7', // amber-100
            '--header': '#14532d', // green-900
            '--text': '#3f3f46', // zinc-700
            '--subtle-text': '#71717a', // zinc-500
            '--surface': '#fafaf9', // stone-50
            '--surface-border': '#e7e5e4', // stone-200
            '--focus-ring': '#4ade80', // green-400
            '--generate-bg': '#65a30d', // lime-600
            '--generate-text': '#1a2e05', // lime-950
            '--generate-hover': '#84cc16', // lime-500
        }
    },
    ocean: {
        name: 'Ocean',
        colors: {
            '--primary': '#0891b2', // cyan-600
            '--primary-hover': '#0e7490', // cyan-700
            '--primary-text': '#ffffff',
            '--secondary': '#0369a1', // sky-700
            '--secondary-hover': '#075985', // sky-800
            '--secondary-text': '#ffffff',
            '--accent': '#38bdf8', // sky-400
            '--bg-start': '#ecfeff', // cyan-50
            '--bg-end': '#e0f2fe', // sky-100
            '--header': '#0c4a6e', // sky-900
            '--text': '#1f2937', // gray-800
            '--subtle-text': '#4b5563', // gray-600
            '--surface': '#f0f9ff', // sky-50
            '--surface-border': '#e0f2fe', // sky-200
            '--focus-ring': '#38bdf8', // sky-400
            '--generate-bg': '#0ea5e9', // sky-500
            '--generate-text': '#f8fafc', // sky-50
            '--generate-hover': '#38bdf8', // sky-400
        }
    },
    sunset: {
        name: 'Sunset',
        colors: {
            '--primary': '#ea580c', // orange-600
            '--primary-hover': '#c2410c', // orange-700
            '--primary-text': '#ffffff',
            '--secondary': '#7f1d1d', // red-900
            '--secondary-hover': '#be123c', // red-700
            '--secondary-text': '#ffffff',
            '--accent': '#f43f5e', // rose-500
            '--bg-start': '#fffbeb', // yellow-50
            '--bg-end': '#fee2e2', // red-100
            '--header': '#7f1d1d', // red-900
            '--text': '#44403c', // stone-700
            '--subtle-text': '#78716c', // stone-500
            '--surface': '#fff7ed', // orange-50
            '--surface-border': '#fee2e2', // red-100
            '--focus-ring': '#fb923c', // orange-400
            '--generate-bg': '#f97316', // orange-500
            '--generate-text': '#ffffff',
            '--generate-hover': '#fb923c', // orange-400
        }
    }
};
