import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!Array.isArray(messages)) {
      return NextResponse.json({ message: "Invalid input: messages must be an array" }, { status: 400 });
    }

    const result = await model.generateContentStream(messages);

    const chunks: string[] = [];
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      chunks.push(chunkText);
    }

    return NextResponse.json({ message: 'success', content: chunks.join('') });
  } catch (error) {
    console.error('Error in content generation:', error);
    return NextResponse.json({ message: "Error in content generation" }, { status: 500 });
  }
}