import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

interface Message {
  role: string;
  content: string;
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const { messages } = await req.json();
    
    if (!Array.isArray(messages)) {
      return new Response('Messages must be an array', { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Simplify the input format
    const prompt = messages.map((msg: Message) => `${msg.role}: ${msg.content}`).join('\n');

    console.log("Sending prompt to Gemini:", prompt);

    const result = await model.generateContentStream(prompt);

    // Create a ReadableStream to process the chunks
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        for await (const chunk of result.stream) {
          const text = chunk.text();
          fullResponse += text;
          console.log("Received chunk:", text);  // Log each chunk
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        }
        console.log("Full response:", fullResponse);  // Log the full response
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

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