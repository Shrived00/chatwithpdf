import { loadS3IntoPinecone } from '@/lib/pinecone'
import { NextResponse } from "next/server"

export async function POST(req: Request, res: Response) {

    try {

        const body = await req.json();

        const { url } = body;
        const pages = await loadS3IntoPinecone(body.storeUrl);
        console.log(pages)
        return NextResponse.json({ pages });


    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }

}