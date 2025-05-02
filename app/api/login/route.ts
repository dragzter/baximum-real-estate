import { NextRequest, NextResponse } from 'next/server';
import { userController } from '@/lib/api/user-management';
// import axios from 'axios';

export async function POST(req: NextRequest) {
	try {
		const { user } = await req.json();

		const response = await userController().save(user);

		return NextResponse.json({ response });
	} catch (error) {
		console.error('Error in POST request:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
