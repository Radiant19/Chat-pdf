import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface Message {
  role: string;
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, chatId } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response('Messages must be an array', { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not set");
    }

    const lastMessage = messages[messages.length-1];

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // const message1= message:[prompt1,...messages.filter((message: Message) => message.role === "user")]
    // Format the prompt for Gemini
    // const prompt = messages.map((msg: Message) => `${msg.role}: ${msg.content}`).join('\n');

    // console.log("Sending prompt to Gemini:", prompt);

    // const result = await model.generateContentStream(prompt);
    // console.log(result);
    // // // Accumulate the chunks as the full response
    
    // for await (const chunk of result.stream) {
    //   const chunkText = chunk.text();
    //   console.log(chunkText)
    // }

    // // console.log("Full response from Gemini:", fullResponse);

    // // Return the response in JSON format
    // // return NextResponse.json({
    // //   role: "assistant",
    // //   content: fullResponse
    // // });
    return NextResponse.json({msg: "hi"}) 

  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
 