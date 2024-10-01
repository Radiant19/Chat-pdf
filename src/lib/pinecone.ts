import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import {Document,RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import { log } from 'console';
import { getEmbeddings } from './embeddings';
import md5 from 'md5'
import { metadata } from '@/app/layout';
import { convertToAscii } from './utils';


export const getPineconeClient = () => {
    return new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  };



// const pinecone = new Pinecone({ apiKey: 'a485d3c7-3f31-4144-a015-a2c142b82d7b' });

type PDFPage={
    pageContent : string;
    metadata:{
        loc:{pageNumber:number}
    }
}
  
export async function loadS3IntoPinecone(fileKey:string){
    //1 obtain th pdf -> download  and read from pdf
    console.log('downloading s3 into file system')
    const file_name = await downloadFromS3(fileKey);
    if(!file_name){
        throw new Error('could not download form s3')
    }
    const loader = new PDFLoader(file_name) 
    const pages  = (await loader.load()) as PDFPage[];

    //2 split and segment the pdf
    // takes pages and splits it into further chunks
    const documents = await Promise.all(pages.map(prepareDocument));

    //3 vectorise and embed individual documents
    const vectors  =  await Promise.all(documents.flat().map(embedDocument))

    //4 upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("chatpdf-yt");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    console.log('inserting vectors into pincecone')
    
    await namespace.upsert(vectors);

    return documents[0];



}

async function embedDocument(doc:Document){
    try {
        const embeddings =  await getEmbeddings(doc.pageContent)
        //id the vector in pinecone 
        const hash = md5(doc.pageContent)

        return {
            id:hash,
            values:embeddings,
            metadata:{
                text:doc.metadata.text,
                pageNumber:doc.metadata.pageNumber,
            }
        } as PineconeRecord;
    } catch (error) {
     console.log('error embedding document',error)
     throw error   
    }
}

export const truncateStringByBytes = (str:string,bytes:number) =>{
    const enc = new TextEncoder()
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0,bytes))
}

async function prepareDocument(page: PDFPage){
    let {pageContent, metadata} = page
    pageContent = pageContent.replace(/\n/g, ' ')
    //split the docs
    const splitter = new RecursiveCharacterTextSplitter()
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata:{
                pageNumber:metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent,38000)
            }
        })
    ])
    return docs
}