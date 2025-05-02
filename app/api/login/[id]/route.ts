import { NextResponse } from 'next/server';
import { userController } from '@/lib/api/user-management';

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
): Promise<Response> {
	try {
		const { id } = await params;

		const user = await userController().get(id);

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error('Error in GET /api/login/[id]:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
