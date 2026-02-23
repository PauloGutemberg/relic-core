import { NextRequest, NextResponse } from "next/server";
import { upstreamJson } from "@/lib/upstream.server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams.toString();
  const path = `/items${qs ? `?${qs}` : ""}`;

  const r = await upstreamJson<any[]>(path);

  if (r.ok === false) {
    return NextResponse.json({ message: r.message }, { status: r.status });
  }

  return NextResponse.json(r.data, { status: 200 });
}