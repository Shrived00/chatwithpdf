import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const config = {
    apiKey: process.env.GEMINI_API_KEY!,
};

const genAI = new GoogleGenerativeAI(config.apiKey);

export async function getEmbeddings(text: string): Promise<number[]> {
    try {
        // Basic input validation
        if (!text || typeof text !== 'string') {
            throw new Error('Invalid input text');
        }

        const cleanedText = text.replace(/\n/g, ' ');
        const model = genAI.getGenerativeModel({ model: 'embedding-001' });

        const result = await model.embedContent(cleanedText);
        const embedding = result.embedding;

        if (embedding) {
            return embedding.values;
        } else {
            throw new Error("No embeddings found in the response.");
        }



    } catch (error) {
        // More specific error handling if needed
        console.error("Embedding error:", error);
        throw error;
    }
}