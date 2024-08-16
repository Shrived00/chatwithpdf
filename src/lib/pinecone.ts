import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { downloadFromS3 } from './s3-server';

import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter'
import { getEmbeddings } from './embeddings';

import md5 from 'md5'
import { convertToAscii } from './utils';


export const getPineconeClient = () => {
    return new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!
    });
};

type PDFPage = {
    pageContent: string;
    metadata: {
        loc: { pageNumber: number }
    }
}

export async function loadS3IntoPinecone(url: string, fileKey: string) {
    //obtain pdf
    console.log('downling pdf to file sys')

    const file_name = await downloadFromS3(url);


    if (!file_name) {
        throw new Error("COuld not download from s3");
    }

    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];


    //split and segment in smaller parts

    const documents = await Promise.all(pages.map(prepareDocument));

    //vectorize and embed it  every smalll doc

    const vectors = await Promise.all(documents.flat().map(embedDocument))

    // upload to pinecone

    const client = await getPineconeClient();
    const pineconeIndex = client.Index('chatwithpdf0');

    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));



    console.log("inserting vectors into pinecone");
    await namespace.upsert(vectors);

    return documents[0];







}

async function embedDocument(doc: Document) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber,
            },
        } as PineconeRecord;


    } catch (error) {
        console.log("error embedding document", error);
        throw error;
    }
}


async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, '');
    //split doc
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000)
            }
        })
    ])
    return docs
}

export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes))
}