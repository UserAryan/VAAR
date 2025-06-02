import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("🔥 POST /api/create-campaign called");
  console.log("📝 Request headers:", Object.fromEntries(req.headers.entries()));

  try {
    const data = await req.json();
    console.log("📦 API Received data:", JSON.stringify(data, null, 2));

    // Send to n8n webhook
    console.log("🚀 Sending to n8n webhook");
    const n8nResponse = await fetch('https://vaar.app.n8n.cloud/webhook/campaign-create', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'VAAR-Test/1.0'
      },
      body: JSON.stringify(data)
    });

    console.log("📥 n8n Response status:", n8nResponse.status);
    console.log("📥 n8n Response headers:", Object.fromEntries(n8nResponse.headers.entries()));
    
    const responseText = await n8nResponse.text();
    console.log("📥 n8n Response body:", responseText);

    if (!n8nResponse.ok) {
      console.error("❌ n8n webhook failed:", responseText);
      throw new Error(`n8n webhook failed: ${responseText}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Campaign sent to n8n successfully',
      n8nResponse: responseText 
    });
  } catch (error) {
    console.error("❌ Error in API route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send to n8n' },
      { status: 500 }
    );
  }
} 