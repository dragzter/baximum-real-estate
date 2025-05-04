import { NextRequest, NextResponse } from 'next/server';
import { propertyManager } from '@/lib/api/property-manager';

export async function POST(req: NextRequest) {
	try {
		const { property } = await req.json();

		const propertyResponse = await propertyManager().save(property);

		return NextResponse.json({ result: propertyResponse });
	} catch (error) {
		console.error('Error in POST request:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}

export async function GET() {
	try {
		const propertyResponse = await propertyManager().getAll();
		return NextResponse.json({ result: propertyResponse });
	} catch (error) {
		console.error('Error in GET request:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
