import { jsPDF } from 'jspdf';
import { Settings, Exercise } from '../types';

interface PdfTranslations {
    title: string;
    topicLabel: string;
    difficultyLabel: string;
    quizQuestions: string;
    answerKey: string;
}

export const generateQuizPdf = (
    settings: Settings, 
    exercises: Exercise[],
    translations: PdfTranslations,
    topic: string,
    difficulty: string,
    includeAnswerKey: boolean
) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let y = 40; // Initial Y position

    // Header
    doc.setFontSize(22);
    doc.text(translations.title, doc.internal.pageSize.width / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`${translations.topicLabel}: ${topic}`, 20, 32);
    doc.text(`${translations.difficultyLabel}: ${difficulty}`, 120, 32);

    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Quiz Questions
    doc.setFontSize(16);
    y += 10;
    doc.text(translations.quizQuestions, 20, y);
    y += 10;
    doc.setFontSize(14);

    exercises.forEach((ex, index) => {
        if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
        }
        const questionText = `${index + 1}.  ${ex.question} __________`;
        doc.text(questionText, 25, y);
        y += 15;
    });

    if (includeAnswerKey) {
        // Answer Key Page
        doc.addPage();
        y = 30; 

        doc.setFontSize(20);
        doc.text(translations.answerKey, doc.internal.pageSize.width / 2, y, { align: 'center' });
        y += 15;

        doc.setFontSize(12);
        
        const midPoint = Math.ceil(exercises.length / 2);
        let currentY = y;
        let currentX = 25;

        exercises.forEach((ex, index) => {
            if (index === midPoint) {
                currentY = y;
                currentX = 110; 
            }
            if (currentY > pageHeight - 20) {
                doc.addPage();
                doc.setFontSize(16);
                doc.text(`${translations.answerKey} (continued)`, doc.internal.pageSize.width / 2, 20, { align: 'center' });
                doc.setFontSize(12);
                currentY = 30;
            }
            const answerText = `${index + 1}.  ${ex.answer}`;
            doc.text(answerText, currentX, currentY);
            currentY += 10;
        });
    }

    const fileName = `Math-Quiz-${settings.topic.replace(' ', '-')}-${settings.difficulty}.pdf`;
    doc.save(fileName);
};
