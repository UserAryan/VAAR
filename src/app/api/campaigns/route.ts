import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Campaign } from '@/types/campaign';

// Mock campaigns data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    campaignName: 'Summer Collection Launch',
    objective: 'Brand Awareness',
    budget: 50000,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    platforms: ['Instagram', 'YouTube'],
    targetAudience: 'Fashion enthusiasts, 18-35',
    deliverables: '10 Instagram posts, 5 YouTube videos',
    notes: 'Focus on sustainable fashion',
    status: 'active',
    createdAt: '2024-03-15T10:00:00Z'
  },
  // Add more mock campaigns as needed
];

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(mockCampaigns);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newCampaign: Campaign = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // In a real application, you would save this to a database
    mockCampaigns.push(newCampaign);

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
} 