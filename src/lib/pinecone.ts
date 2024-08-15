import { Pinecone } from '@pinecone-database/pinecone';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { downloadFromS3 } from './s3-server';


export const getPineconeClient = () => {
    return new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!
    });
};

export async function loadS3IntoPinecone(url: string) {
    //obtain pdf
    console.log('downling pdf to file sys')

    const file_name = await downloadFromS3(url);


    if (!file_name) {
        throw new Error("COuld not download from s3");
    }

    const loader = new PDFLoader(file_name);
    const pages = await loader.load();
    return pages;


}