import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const testData = {
      campaignName: "Test Campaign",
      objective: "Brand Awareness",
      budget: 1000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      platforms: ["Instagram", "YouTube"],
      targetAudience: "Test Audience",
      deliverables: "Test Deliverables",
      notes: "Test Notes",
      campaignId: `test_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    console.log('Testing n8n webhook with data:', JSON.stringify(testData, null, 2));

    const response = await fetch('https://vaar.app.n8n.cloud/webhook/campaign-create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'VAAR-Test/1.0'
      },
      body: JSON.stringify(testData)
    });

    console.log('Webhook response status:', response.status);
    console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Webhook response:', responseText);

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      responseText,
      testData
    });
  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to test webhook' },
      { status: 500 }
    );
  }
} 