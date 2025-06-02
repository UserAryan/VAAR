import { NextResponse } from 'next/server';

export async function GET() {
  console.log("🔥 GET /api/test called");
  return NextResponse.json({ message: "Test endpoint working" });
}

export async function POST(req: Request) {
  console.log("🔥 POST /api/test called");
  const data = await req.json();
  console.log("📦 Test endpoint received:", data);
  return NextResponse.json({ 
    message: "Test endpoint received data",
    received: data 
  });
} 