import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, token: "mock-token" });
}

export async function POST() {
  return NextResponse.json({ success: true, url: "/logo.svg" });
}

export type EdgeStoreRouter = any;
