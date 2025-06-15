import { NextResponse } from "next/server";

export async function GET() {
	const password = process.env.APP_PASSWORD;

	if (!password) {
		return NextResponse.json({ error: "Missing password" }, { status: 500 });
	}

	return NextResponse.json({ message: "Access granted", phrase: password });
}
