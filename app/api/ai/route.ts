import { NextRequest, NextResponse } from 'next/server';
import { AiController } from '@/lib/api/ai';
import { properties } from '@/lib/data';

const ai = new AiController();

export async function POST(req: NextRequest) {
	try {
		const { data, isDashBoard, supporting } = await req.json();
		let aiPrompt = '';

		if (isDashBoard && supporting) {
			aiPrompt = data + ` - We are discussing this property: ${JSON.stringify(supporting)}`;
		} else if (!isDashBoard) {
			aiPrompt =
				data + `- Here is a list of all the properties: ${JSON.stringify(properties)}`;
		}

		const aiResponse = await ai.ask2(aiPrompt);

		return NextResponse.json({ result: aiResponse });
	} catch (error) {
		console.error('Error in POST request:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
