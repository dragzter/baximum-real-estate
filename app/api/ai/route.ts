import { NextRequest, NextResponse } from "next/server";
import { AiController } from "@/lib/api/ai";

const ai = new AiController();

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();
    console.log(data);

    const aiResponse = await ai.ask(data);

    return NextResponse.json({ result: aiResponse });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
