import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Deployment from "@/models/Deployment";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const deployment = await Deployment.create(body);
  return NextResponse.json(deployment);
}

export async function GET(req: NextRequest) {
  await connectDB();

  // Extract the query parameter from the request URL
  const { searchParams } = new URL(req.url);
  const envType = searchParams.get("envType");

  // Build query dynamically based on envType
  const query = envType ? { envType } : {};

  const deployments = await Deployment.find(query).sort({ createdAt: -1 });

  return NextResponse.json(deployments);
}
