// import { Pinecone } from "@pinecone-database/pinecone";
// import { convertToAscii } from "./utils";
// import { getEmbeddings } from "./embeddings";

// export async function getMatchesFromEmbeddings(
//   embeddings: number[],
//   fileKey: string
// ) {
//   try {
//     const client = new Pinecone({
//       apiKey: process.env.PINECONE_API_KEY!,
//     });
//     const pineconeIndex = await client.index("chatpdf-yt");
//     const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
//     const queryResult = await namespace.query({
//       topK: 5,
//       vector: embeddings,
//       includeMetadata: true,
//     });
//     return queryResult.matches || [];
//   } catch (error) {
//     console.log("error quering embeddings", error);
//     throw error;
//   }
// }

// export async function getContext(query: string, fileKey: string) {
//   const queryEmbeddings = await getEmbeddings(query);
//   const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

//   const qualifyingDocs = matches.filter(
//     (match) => match.score && match.score > 0.7
//   );
//   type Metadata = {
//     text: string;
//     pageNumber: number;
//   };

//   let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
// //   5 vectors
//   return docs.join('\n').substring(0,3000)
// }


// import { Pinecone } from "@pinecone-database/pinecone";
// import { convertToAscii } from "./utils";
// import { getEmbeddings } from "./embeddings";

// export async function getMatchesFromEmbeddings(
//   embeddings: number[],
//   fileKey: string
// ) {
//   try {
//     console.log("Embeddings:", embeddings);
//     console.log("File key:", fileKey);

//     const client = new Pinecone({
//       apiKey: process.env.PINECONE_API_KEY!,
//     });
//     console.log("Pinecone client created");

//     const pineconeIndex = await client.index("chatpdf-yt");
//     console.log("Pinecone index accessed");

//     const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
//     console.log("Namespace:", convertToAscii(fileKey));

//     const queryResult = await namespace.query({
//       topK: 5,
//       vector: embeddings,
//       includeMetadata: true,
//     });
//     console.log("Query result:", queryResult);

//     return queryResult.matches || [];
//   } catch (error) {
//     console.log("error querying embeddings", error);
//     throw error;
//   }
// }

// export async function getContext(query: string, fileKey: string) {
//   console.log("Query:", query);
//   const queryEmbeddings = await getEmbeddings(query);
//   console.log("Query embeddings:", queryEmbeddings);

//   const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
//   console.log("Matches:", matches);

//   const qualifyingDocs = matches.filter(
//     (match) => match.score && match.score > 0.7
//   );
//   console.log("Qualifying docs:", qualifyingDocs);

//   type Metadata = {
//     text: string;
//     pageNumber: number;
//   };

//   let docs = qualifyingDocs.map((match) => {
//     console.log("Match metadata:", match.metadata);
//     return (match.metadata as Metadata).text;
//   });
//   console.log("Docs:", docs);

//   return docs.join('\n').substring(0, 3000);
// }


import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    console.log("Embeddings:", embeddings);
    console.log("File key:", fileKey);

    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    console.log("Pinecone client created");

    const pineconeIndex = await client.index("chatpdf-yt");
    console.log("Pinecone index accessed");

    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    console.log("Namespace:", convertToAscii(fileKey));

    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    console.log("Query result:", queryResult);

    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  console.log("Query:", query);
  const queryEmbeddings = await getEmbeddings(query);
  console.log("Query embeddings:", queryEmbeddings);

  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  console.log("Matches:", matches);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.6
  );
  console.log("Qualifying docs:", qualifyingDocs);

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => {
    console.log("Match metadata:", match.metadata);
    return (match.metadata as Metadata).text;
  });
  console.log("Docs:", docs);

  return docs.join('\n').substring(0, 3000);
}