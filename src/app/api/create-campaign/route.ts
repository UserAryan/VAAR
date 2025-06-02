import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, description, budget, requirements, startDate, endDate } = data;

    // Create campaign in database
    const campaign = await db.campaign.create({
      data: {
        name,
        description,
        budget: parseFloat(budget),
        requirements,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'DRAFT',
        brandId: session.user.id
      }
    });

    // Send webhook to n8n
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        const response = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            campaignId: campaign.id,
            name: campaign.name,
            description: campaign.description,
            budget: campaign.budget,
            requirements: campaign.requirements,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            brandId: session.user.id,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          console.error('Failed to send webhook to n8n:', await response.text());
        }
      } catch (error) {
        console.error('Error sending webhook to n8n:', error);
      }
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
} 