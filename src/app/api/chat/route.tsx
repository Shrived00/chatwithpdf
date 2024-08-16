import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { google } from "@ai-sdk/google";
import { type CoreMessage, streamText } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, chatId }: { messages: CoreMessage[], chatId: number } = await req.json();

    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));



    if (_chats.length != 1) {
        return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    console.log(lastMessage)


    let lastMessageContent: string = '';

    if (typeof lastMessage === 'string') {
        lastMessageContent = lastMessage;
    } else if (Array.isArray(lastMessage)) {
        lastMessageContent = lastMessage.map(part => (typeof part === 'string' ? part : '')).join('');
    } else if (typeof lastMessage === 'object' && 'content' in lastMessage) {
        lastMessageContent = (lastMessage as { content: string }).content || '';
    }

    // Now you can use lastMessageContent as a string

    // Fetch the context based on the last message content and fileKey
    const context = await getContext(lastMessageContent, fileKey);
    console.log(context)

    // Construct the prompt as a CoreMessage object
    const prompt: CoreMessage = {
        role: "system",
        content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
        AI assistant is a big fan of Pinecone and Vercel.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to a question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
        AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
        AI assistant will not invent anything that is not drawn directly from the context.`,
    };

    // Filter user messages and add the prompt as the first message
    const result = await streamText({
        model: google("models/gemini-1.5-flash-latest"),
        system: "You are a helpful assistant",
        messages: [
            prompt, // Include the prompt as the first message
            ...messages.filter(message => message.role === 'user'),
        ],
    });

    return result.toAIStreamResponse();
}
