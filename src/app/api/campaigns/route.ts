import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { Campaign } from '@/types/campaign';

// Mock campaigns data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    campaignName: 'Summer Collection Launch',
    objective: 'Brand Awareness',
    budget: 5000,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    platforms: ['Instagram', 'TikTok'],
    targetAudience: 'Fashion enthusiasts, 18-35',
    deliverables: '10 posts, 5 stories, 2 reels',
    status: 'active',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    campaignName: 'Holiday Special',
    objective: 'Sales',
    budget: 8000,
    startDate: '2024-11-15',
    endDate: '2024-12-31',
    platforms: ['Instagram', 'YouTube'],
    targetAudience: 'Shoppers, 25-45',
    deliverables: '15 posts, 8 stories, 3 videos',
    status: 'draft',
    createdAt: '2024-03-14T15:30:00Z',
  },
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
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    mockCampaigns.push(newCampaign);
    return NextResponse.json(newCampaign);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
} 