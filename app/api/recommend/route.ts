import { NextRequest, NextResponse } from "next/server";
import { getSimilarStories } from "@/lib/actian";

export async function POST(req: NextRequest) {
  const { query, topK = 3 } = await req.json();
  if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  const suggestions = await getSimilarStories(query, topK);
  return NextResponse.json({ suggestions });
}
