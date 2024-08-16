import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { loadS3IntoPinecone } from '@/lib/pinecone'
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server"

export async function POST(req: Request, res: Response) {

    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    try {

        const body = await req.json();

        const { url, file_key, file_name } = body;
        const pages = await loadS3IntoPinecone(body.storeUrl, file_key);

        const chat_id = await db
            .insert(chats)
            .values({
                fileKey: file_key,
                pdfName: file_name,
                pdfUrl: body.storeUrl,
                userId,
            })
            .returning({
                insertedId: chats.id,
            });


        return NextResponse.json({ chat_id: chat_id[0].insertedId }, { status: 200 });


    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }

}