// import { getContext } from '@/lib/context';
// import { db } from '@/lib/db';
// import { chats } from '@/lib/db/schema';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { eq } from 'drizzle-orm';
// import { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';

// interface Message {
//   role: string;
//   content: string;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { messages, chatId } = await req.json();

    

//     const _chats = await db.select().from(chats).where(eq(chats.id,chatId))
//     if(_chats.length != 1){
//       return NextResponse.json({'error':'chat not found'},{status:404})
//     }
//     const fileKey = _chats[0].fileKey
//     const message1= messages[...messages.filter((message: Message) => message.role === "user")]
//     const lastMessage = message1[message1.length-1];
//     const context = await getContext(lastMessage.content,fileKey)
//     const prompt1  = {
//       role: "system",
//       content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
//       The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
//       AI is a well-behaved and well-mannered individual.
//       AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
//       AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
//       AI assistant is a big fan of Pinecone and Vercel.
//       START CONTEXT BLOCK
//       ${context}
//       END OF CONTEXT BLOCK
//       AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
//       If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
//       AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
//       AI assistant will not invent anything that is not drawn directly from the context.
//       `,
//     };
//     const prompt = [prompt1,lastMessage]
    
 

//     if (!Array.isArray(messages)) {
//       return new Response('Messages must be an array', { status: 400 });
//     }

//     const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
//     if (!apiKey) {
//       throw new Error("Gemini API key is not set");
//     }

//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
//     console.log("Sending prompt to Gemini:", prompt);

//     const result = await model.generateContentStream(prompt);
//     // console.log({result,lastMessage});
//     // // // Accumulate the chunks as the full response
    
//     for await (const chunk of result.stream) {
//       const chunkText = chunk.text();
//       console.log(chunkText)
//     }

//     console.log("Full response from Gemini:", fullResponse);

//     Return the response in JSON format
//     return NextResponse.json({
//       role: "assistant",
//       content: fullResponse
//     });
//     // return NextResponse.json({msg: "hi"}) 

//   } catch (error) {
//     console.error("Error processing request:", error);
//     if (error instanceof Error) {
//       console.error("Error details:", error.message);
//     }
//     return new Response(JSON.stringify({ error: "Internal server error" }), { 
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }
 

// import { getContext } from '@/lib/context';
// import { db } from '@/lib/db';
// import { chats } from '@/lib/db/schema';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { eq } from 'drizzle-orm';
// import { NextRequest, NextResponse } from 'next/server';

// interface Message {
//   role: string;
//   content: string;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { messages, chatId } = await req.json();

//     if (!Array.isArray(messages)) {
//       return NextResponse.json({ error: 'Messages must be an array' }, { status: 400 });
//     }

//     const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
//     if (_chats.length !== 1) {
//       return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
//     }

//     const fileKey = _chats[0].fileKey;
//     const userMessages = messages.filter((message: Message) => message.role === "user");
//     const lastMessage = userMessages[userMessages.length - 1];
    
//     const context = await getContext(lastMessage.content, fileKey);
//     console.log("the value of the array are - ",context);
    
//     const systemPrompt = `AI assistant is a brand new, powerful, human-like artificial intelligence.
//     The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
//     AI is a well-behaved and well-mannered individual.
//     AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
//     AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
//     AI assistant is a big fan of Pinecone and Vercel.
//     START CONTEXT BLOCK
//     ${context}
//     END OF CONTEXT BLOCK
//     AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
//     If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
//     AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
//     AI assistant will not invent anything that is not drawn directly from the context.`;

//     const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
//     if (!apiKey) {
//       throw new Error("Gemini API key is not set");
//     }

//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
//     const prompt = systemPrompt + "\n\nUser: " + lastMessage.content;
    
//     console.log("Sending prompt to Gemini:", prompt);

//     const result = await model.generateContentStream([prompt]);
    
//     let fullResponse = '';
    
//     const stream = new ReadableStream({
//       async start(controller) {
//         for await (const chunk of result.stream) {
//           const chunkText = chunk.text();
//           fullResponse += chunkText;
//           console.log("Chunk received:", chunkText);
//           controller.enqueue(chunkText);
//         }
//         console.log("Full response:", fullResponse);
//         controller.close();
//       },
//     });

//     return new Response(stream, {
//       headers: {
//         'Content-Type': 'text/plain',
//         'Transfer-Encoding': 'chunked',
//       },
//     });

//   } catch (error) {
//     console.error("Error processing request:", error);
//     if (error instanceof Error) {
//       console.error("Error details:", error.message);
//     }
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }



import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: string;
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, chatId } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages must be a non-empty array' }, { status: 400 });
    }

    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    const userMessages = messages.filter((message: Message) => message.role === "user");
    const lastMessage = userMessages[userMessages.length - 1];
    
    if (!lastMessage) {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 });
    }
    
    const context = await getContext(lastMessage.content, fileKey);
    console.log("Context:", context);
    
    const systemPrompt = `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    AI assistant is a big fan of Pinecone and Vercel.
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context.`;

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `${systemPrompt}\n\nUser: ${lastMessage.content}`;
    
    console.log("Sending prompt to Gemini:", prompt);

    const result = await model.generateContent([prompt]);
    const response = result.response;
    const text = response.text();
    
    console.log("Full response:", text);

    // Add the AI's response to the messages array
    messages.push({
      role: "assistant",
      content: text
    });
    console.log(messages)

    return NextResponse.json({ messages });

  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
