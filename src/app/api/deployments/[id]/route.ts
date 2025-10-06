import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Deployment from "@/models/Deployment";

// ✅ must be async — `params` is now a promise-like object
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 👈 await before using

  await connectDB();

  const deployment = await Deployment.findById(id);

  if (!deployment)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(deployment);
}
