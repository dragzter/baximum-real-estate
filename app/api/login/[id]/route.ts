import { NextResponse } from "next/server";
import { userController } from "@/lib/api/user-management";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
	try {
		const { id } = await params;

		const user = await userController().get(id);
		if (!user) {
			return NextResponse.json({ status: 204 });
		}

		return NextResponse.json(user, { status: 200 });
	} catch (error) {
		console.error("Error in GET /api/login/[id]:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
