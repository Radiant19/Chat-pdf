// const  GoogleGenerativeAI  = require("@google/generative-ai");

// // Access your API key as an environment variable (see our Getting Started tutorial)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function getEmbeddings(text:string) {
// // For embeddings, use the Text Embeddings model
// const model = genAI.getGenerativeModel({ model: "text-embedding-004"});

// const result = await model.embedContent(text.replace(/\n/g,' '));
// const embedding = result.embedding;
// // console.log(embedding.values);
// const finalresult  = await embedding.json();
// return finalresult.data[0].embedding as number[];
// }

import { GoogleGenerativeAI, GenerativeModel, EmbedContentResponse } from "@google/generative-ai";

// Make sure to declare this in your environment or use a type-safe config library
declare const process: {
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: string;
  };
};

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function getEmbeddings(text: string): Promise<number[]> {
  // For embeddings, use the Text Embeddings model
  const model: GenerativeModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

  const result: EmbedContentResponse = await model.embedContent(text.replace(/\n/g, ' '));
  
  // Check if the embedding is available in the result
  if (result.embedding && Array.isArray(result.embedding.values)) {
    console.log(result.embedding.values);
    return result.embedding.values;
    
  }
  
  // If the embedding or its values are not available, throw an error
  throw new Error("Unexpected embedding format received from the API");
}
