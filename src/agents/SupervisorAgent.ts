import { Campaign, CreateCampaignData } from '@/types/campaign';

export interface SystemStatus {
  campaigns: { active: number; total: number };
  agents: { online: number; total: number };
}

export class SupervisorAgent {
  private campaigns: Campaign[] = [];
  private agents: { online: number; total: number } = { online: 0, total: 0 };

  constructor() {
    this.agents = { online: 3, total: 5 };
  }

  getSystemStatus(): SystemStatus {
    return {
      campaigns: {
        active: this.campaigns.filter(c => c.status === 'active').length,
        total: this.campaigns.length
      },
      agents: this.agents
    };
  }

  async createCampaign(data: CreateCampaignData): Promise<Campaign> {
    const campaign: Campaign = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    this.campaigns.push(campaign);
    return campaign;
  }
} 