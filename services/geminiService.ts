
import { GoogleGenAI } from "@google/genai";
import { Settings, Exercise } from '../types';
import { Language } from '../contexts/LanguageContext';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (settings: Settings, language: Language): string => {
    const langInstruction = language === 'km' 
        ? 'Generate the math problems in Khmer language. For word problems, use simple Khmer words appropriate for children.' 
        : 'Generate the math problems in English language.';
    
    const topicInstruction = language === 'km' && settings.topic === 'Mixed'
        ? 'The topic is Mixed (ចម្រុះ), which includes Addition (បូក), Subtraction (ដក), Multiplication (គុណ), and Division (ចែក).'
        : `The topic is ${settings.topic}.`;


    return `
You are an expert in creating age-appropriate math exercises for children.
Generate ${settings.count} math problems based on the following criteria:
- Topic: ${settings.topic}
- Difficulty: ${settings.difficulty}

${langInstruction}
${topicInstruction}

The difficulty levels correspond to:
- Easy: Single-digit numbers for addition/subtraction. For multiplication, factors up to 5. For division, simple divisions with no remainder.
- Medium: Double-digit numbers. For multiplication, factors up to 12. For division, may result in simple remainders but focus on whole number answers.
- Hard: Multi-digit numbers, multi-step problems, or simple word problems. Division will have remainders.

Return the response ONLY as a valid JSON array of objects. Each object must have two keys: "question" (a string ending with '=') and "answer" (a number).
Do not include any other text, explanation, or markdown formatting like \`\`\`json. Your entire response should be the JSON array itself.

Example format for English:
[
  { "question": "5 + 3 =", "answer": 8 },
  { "question": "10 - 2 =", "answer": 8 }
]

Example format for Khmer:
[
  { "question": "៥ + ៣ =", "answer": 8 },
  { "question": "១០ - ២ =", "answer": 8 }
]
`;
};

export const generateExercises = async (settings: Settings, language: Language): Promise<Exercise[]> => {
    try {
        const prompt = generatePrompt(settings, language);
        
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-04-17",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 1.0,
          }
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr);
        
        if (!Array.isArray(parsedData) || parsedData.some(item => typeof item.question !== 'string' || typeof item.answer !== 'number')) {
            throw new Error('API returned data in an unexpected format.');
        }

        return parsedData as Exercise[];
    } catch (error) {
        console.error("Error generating exercises:", error);
        throw new Error("Failed to generate math exercises. The AI might be busy, please try again.");
    }
};
