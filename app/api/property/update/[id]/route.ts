import { NextResponse } from 'next/server';
import { propertyManager } from '@/lib/api/property-manager';

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
): Promise<Response> {
	try {
		const { id } = await params;
		const { updateData } = await req.json();

		console.log('ID', id);

		const response = await propertyManager().update(id, updateData);

		if (!response) {
			return NextResponse.json({ error: 'Property update failed.' }, { status: 404 });
		}

		return NextResponse.json(response);
	} catch (error) {
		console.error('Error in PATCH /api/property/update/[id]:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
