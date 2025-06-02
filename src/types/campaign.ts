export interface CreateCampaignData {
  campaignName: string;
  objective: string;
  budget: number;
  startDate: string;
  endDate: string;
  platforms: string[];
  targetAudience: string;
  deliverables: string;
  notes: string;
}

export interface Campaign extends CreateCampaignData {
  id: string;
  status: 'active' | 'completed' | 'pending';
  createdAt: string;
  analytics?: {
    engagement: {
      likes: number;
      comments: number;
      shares: number;
      reach: number;
      impressions: number;
      engagementRate: number;
      growthRate: number;
      conversionRate: number;
      roi: number;
    };
    demographics: {
      ageGroups: Record<string, number>;
      gender: Record<string, number>;
      locations: Record<string, number>;
    };
    timeline: Array<{
      date: string;
      engagement: number;
      reach: number;
      conversions: number;
    }>;
  };
} 