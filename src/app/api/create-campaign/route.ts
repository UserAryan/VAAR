import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      campaignName,
      objective,
      budget,
      startDate,
      endDate,
      platforms,
      targetAudience,
      deliverables,
      notes
    } = data;

    // Validate required fields
    if (!campaignName || !objective || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a temporary campaign ID
    const campaignId = `temp_${Date.now()}`;

    // Send webhook to n8n
    const n8nWebhookUrl = 'https://vaar.app.n8n.cloud/webhook/campaign-create';
    try {
      console.log('Sending webhook to n8n:', n8nWebhookUrl);
      const webhookData = {
        campaignName,
        objective,
        budget: parseFloat(budget),
        startDate,
        endDate,
        platforms,
        targetAudience,
        deliverables,
        notes,
        campaignId,
        timestamp: new Date().toISOString()
      };
      console.log('Webhook data:', JSON.stringify(webhookData, null, 2));

      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(webhookData),
      });

      console.log('Webhook response status:', response.status);
      console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send webhook to n8n:', errorText);
        throw new Error(`Failed to send webhook to n8n: ${errorText}`);
      }

      const responseData = await response.text();
      console.log('Webhook response:', responseData);

      return NextResponse.json({
        campaignId,
        status: 'success',
        message: 'Campaign webhook sent successfully',
        data: webhookData
      });
    } catch (error) {
      console.error('Error sending webhook to n8n:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to send webhook to n8n' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create campaign' },
      { status: 500 }
    );
  }
} 