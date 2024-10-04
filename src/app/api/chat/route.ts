import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return NextResponse.json({ message: "Invalid JSON payload received" }, { status: 400 });
    }

    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ message: "Invalid input: messages must be a non-empty array" }, { status: 400 });
    }

    if (messages.length === 0) {
      return NextResponse.json({ message: "Invalid input: messages array is empty" }, { status: 400 });
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
    return NextResponse.json({ message: "Error in content generation", error: (error as Error).message }, { status: 500 });
  }
}