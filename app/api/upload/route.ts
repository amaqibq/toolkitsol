import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
	const form = await req.formData();
	const file = form.get("file");
	if (!(file instanceof Blob)) {
		return Response.json({ error: "No file uploaded" }, { status: 400 });
	}
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const uploadsDir = path.join(process.cwd(), "public", "uploads");
	if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
	const ext = (file as any).name?.split(".").pop() || "bin";
	const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
	const filePath = path.join(uploadsDir, filename);
	fs.writeFileSync(filePath, buffer);
	const url = `/uploads/${filename}`;
	return Response.json({ url });
}



