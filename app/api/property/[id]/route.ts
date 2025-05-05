import { NextResponse } from 'next/server';
import { propertyManager } from '@/lib/api/property-manager';

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
): Promise<Response> {
	try {
		const { id } = await params;

		const response = await propertyManager().delete(id);

		if (!response) {
			return NextResponse.json({ error: 'API Delete failed' }, { status: 404 });
		}

		return NextResponse.json(response);
	} catch (error) {
		console.error('Error in DELETE /api/property/[id]:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const response = await propertyManager().get(id);

		if (!response) {
			return NextResponse.json({ error: 'API Get failed' }, { status: 404 });
		}

		return NextResponse.json(response);
	} catch (error) {
		console.error('Error in GET /api/property/[id]:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
