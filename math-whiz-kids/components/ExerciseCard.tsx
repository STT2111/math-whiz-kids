
import React from 'react';
import { CheckIcon, CrossIcon } from './icons';

interface ExerciseCardProps {
    index: number;
    question: string;
    userAnswer: string;
    onAnswerChange: (index: number, value: string) => void;
    isCorrect: boolean | null;
    isSubmitted: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ index, question, userAnswer, onAnswerChange, isCorrect, isSubmitted }) => {
    
    const borderClass = isSubmitted
        ? isCorrect ? 'border-green-500' : 'border-red-500'
        : 'border-[var(--surface-border)]';
    
    const icon = isSubmitted
        ? isCorrect 
            ? <CheckIcon className="h-6 w-6 text-green-500" /> 
            : <CrossIcon className="h-6 w-6 text-red-500" />
        : null;

    return (
        <div className={`bg-[var(--surface)] p-4 rounded-lg shadow-sm border-2 ${borderClass} transition-colors flex items-center gap-4`}>
            <div className="flex-shrink-0 text-xl font-bold text-[var(--subtle-text)]">{index + 1}.</div>
            <div className="flex-grow text-2xl font-bold text-[var(--text)] tracking-wider">
                {question}
            </div>
            <input
                type="number"
                value={userAnswer}
                onChange={(e) => onAnswerChange(index, e.target.value)}
                className="w-24 p-2 text-2xl font-bold text-center bg-[var(--surface)] border-2 border-[var(--surface-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                disabled={isSubmitted}
            />
            <div className="w-6 h-6">{icon}</div>
        </div>
    );
};

export default ExerciseCard;