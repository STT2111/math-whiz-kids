
export enum Topic {
    ADDITION = 'Addition',
    SUBTRACTION = 'Subtraction',
    MULTIPLICATION = 'Multiplication',
    DIVISION = 'Division',
    MIXED = 'Mixed'
}

export enum Difficulty {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard'
}

export interface Settings {
    topic: Topic;
    difficulty: Difficulty;
    count: number;
}

export interface Exercise {
    question: string;
    answer: number;
}

export interface UserAnswer {
    [key: number]: string;
}

export enum Status {
    IDLE,
    LOADING,
    READY,
    CHECKED,
    ERROR
}
