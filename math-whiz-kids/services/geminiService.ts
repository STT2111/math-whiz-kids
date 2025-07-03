
import { GoogleGenAI } from "@google/genai";
import { Settings, Exercise } from '../types';
import { Language } from '../contexts/LanguageContext';

let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
    if (ai) {
        return ai;
    }

    // This check is safer for browsers where `process` might not be defined.
    // It uses optional chaining and throws a specific error if the key is missing.
    const apiKey = process?.env?.API_KEY;

    if (!apiKey) {
        throw new Error("Configuration Error: The API_KEY is not configured in the environment.");
    }
    
    ai = new GoogleGenAI({ apiKey });
    return ai;
}

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

Return the response ONLY as a valid, RFC 8259 compliant JSON array of objects. Each object must have two keys: "question" (a string ending with '=') and "answer" (a number).
Ensure there are no trailing commas in the JSON array or objects within it.
Do not include any other text, explanation, or markdown formatting like \`\`\`json. Your entire response must be ONLY the JSON array itself.

Example format for English (no trailing comma):
[
  { "question": "5 + 3 =", "answer": 8 },
  { "question": "10 - 2 =", "answer": 8 }
]

Example format for Khmer (no trailing comma):
[
  { "question": "៥ + ៣ =", "answer": 8 },
  { "question": "១០ - ២ =", "answer": 8 }
]
`;
};

export const generateExercises = async (settings: Settings, language: Language): Promise<Exercise[]> => {
    try {
        const geminiAi = getAiClient();
        const prompt = generatePrompt(settings, language);
        
        const response = await geminiAi.models.generateContent({
          model: "gemini-2.5-flash-preview-04-17",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.5,
          }
        });

        let jsonStr = response.text.trim();
        
        // 1. Clean the string: Remove markdown fences and any text outside the main array.
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }
        
        const startIndex = jsonStr.indexOf('[');
        const endIndex = jsonStr.lastIndexOf(']');
        if (startIndex !== -1 && endIndex > startIndex) {
            jsonStr = jsonStr.substring(startIndex, endIndex + 1);
        }

        // 2. Attempt to parse the cleaned string.
        let parsedData;
        try {
            parsedData = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error("Failed to parse JSON response from AI.", {
                rawResponse: response.text,
                cleanedResponse: jsonStr,
                error: parseError,
            });
            throw new Error('The AI returned data in an unexpected format. Please try again.');
        }
        
        // 3. Validate the structure of the parsed data.
        if (!Array.isArray(parsedData) || parsedData.some(item => typeof item.question !== 'string' || typeof item.answer !== 'number')) {
            console.error("Parsed data from AI has an incorrect structure.", parsedData);
            throw new Error('The AI returned data with an unexpected structure. Please try again.');
        }

        return parsedData as Exercise[];
    } catch (error) {
        console.error("Error generating exercises:", error);
        
        if (error instanceof Error) {
            // Re-throw specific, user-friendly errors.
            if (error.message.includes("Configuration Error") || error.message.includes("API_KEY is not configured")) {
                 throw new Error("Configuration issue: The application is not set up correctly. Please inform the site administrator.");
            }
             if (error.message.includes("API key not valid")) {
                throw new Error("Authentication Error: The API key is invalid. Please contact the administrator.");
            }
             if (error.message.toLowerCase().includes('failed to fetch')) {
                 throw new Error("Network Error: Could not connect to the AI service. Please check your internet connection.");
            }
             if (error.message.includes("unexpected format") || error.message.includes("unexpected structure")) {
                throw error; // Re-throw the already user-friendly error from the parsing logic.
             }
        }

        // Fallback for any other unexpected errors from the Gemini API.
        throw new Error("Failed to generate math exercises. The AI service may be busy. Please try again later.");
    }
};
