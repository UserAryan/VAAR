import { CreateCampaignData } from '@/types/campaign';

export class SupervisorAgent {
  async createCampaign(campaignData: CreateCampaignData) {
    try {
      const response = await fetch('/api/create-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create campaign');
      }

      const result = await response.json();
      return {
        campaignId: result.campaignId,
        status: 'success',
        message: 'Campaign created successfully',
        data: result.data
      };
    } catch (error) {
      console.error('Campaign creation failed:', error);
      throw error;
    }
  }
} 