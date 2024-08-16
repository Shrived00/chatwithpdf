
import { google } from "@ai-sdk/google";
import { type CoreMessage, streamText } from "ai";

export const runtime = 'edge'

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: CoreMessage[] } = await req.json();

    const result = await streamText({
        model: google("models/gemini-1.5-flash-latest"),
        system: "You are a helpful assistant",
        messages,
    });

    return result.toAIStreamResponse();
}













// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { chats, messages as _messages } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import { getContext } from "@/lib/context";
// // Import the Gemini AI SDK (this is a placeholder, use the actual import)
// import { GeminiAI } from "gemini-ai";

// export const runtime = "edge";

// // Initialize Gemini AI client (adjust according to actual Gemini AI SDK)
// const gemini = new GeminiAI({
//     apiKey: process.env.GEMINI_API_KEY,
// });

// export async function POST(req: Request) {
//     try {
//         const { messages, chatId } = await req.json();
//         const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
//         if (_chats.length != 1) {
//             return NextResponse.json({ error: "chat not found" }, { status: 404 });
//         }

//         const fileKey = _chats[0].fileKey;
//         const lastMessage = messages[messages.length - 1];
//         const context = await getContext(lastMessage.content, fileKey);

//         const prompt = `
//       AI assistant is a brand new, powerful, human-like artificial intelligence.
//       The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
//       AI is a well-behaved and well-mannered individual.
//       AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
//       AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
//       START CONTEXT BLOCK
//       ${context}
//       END OF CONTEXT BLOCK
//       AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
//       If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
//       AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
//       AI assistant will not invent anything that is not drawn directly from the context.
//     `;

//         // Adjust this part according to Gemini AI's actual API
//         const response = await gemini.createChatCompletion({
//             model: "gemini-pro", // Use the appropriate model name
//             messages: [
//                 { role: "system", content: prompt },
//                 ...messages.filter((message: Message) => message.role === "user"),
//             ],
//             stream: true,
//         });

//         // Implement streaming response (adjust according to Gemini AI's streaming capabilities)
//         const stream = GeminiAIStream(response, {
//             onStart: async () => {
//                 await db.insert(_messages).values({
//                     chatId,
//                     content: lastMessage.content,
//                     role: "user",
//                 });
//             },
//             onCompletion: async (completion) => {
//                 await db.insert(_messages).values({
//                     chatId,
//                     content: completion,
//                     role: "system",
//                 });
//             },
//         });

//         return new StreamingTextResponse(stream);
//     } catch (error) {
//         console.error("Error in Gemini AI request:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
