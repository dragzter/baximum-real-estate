import { NextRequest, NextResponse } from 'next/server';
import { userController } from '@/lib/api/user-management';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params;

		const response = await userController().get(id);

		console.log(response, 'user get');

		return NextResponse.json({ response });
	} catch (error) {
		console.error('Error in POST request:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
