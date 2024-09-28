import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";



// export const getPineconeClient = () => {
//     return new Pinecone({
      
//       apiKey: process.env.PINECONE_API_KEY!,
//     });
//   };

const pinecone = new Pinecone({ apiKey: 'a485d3c7-3f31-4144-a015-a2c142b82d7b' });
  
export async function loadS3IntoPinecone(fileKey:string){
    // download the pdf and read
    console.log('downloading s3 into file system')
    const file_name = await downloadFromS3(fileKey);
    if(!file_name){
        throw new Error('could not download form s3')
    }
    const loader = new PDFLoader(file_name)
    const pages  = await loader.load()
    return pages;
}
