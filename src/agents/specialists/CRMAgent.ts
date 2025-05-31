import { Database } from 'lucide-react';
import { Agent, Task } from '../base/Agent';

interface CreatorProfileUpdate {
  creatorId: string;
  updates: Record<string, any>;
}

interface InteractionData {
  type: string;
  participants: string[];
}

interface CampaignSyncData {
  campaignId: string;
}

export class CRMAgent extends Agent {
  constructor() {
    super(
      'CRM Data Agent',
      'data_management',
      ['UPDATE_CRM', 'MANAGE_RELATIONSHIPS', 'DATA_SYNC'],
      Database
    );
  }

  async executeTask(task: Task) {
    const { action, data } = task.payload as { 
      action: 'UPDATE_CREATOR_PROFILE' | 'LOG_INTERACTION' | 'SYNC_CAMPAIGN_DATA',
      data: CreatorProfileUpdate | InteractionData | CampaignSyncData
    };
    
    switch (action) {
      case 'UPDATE_CREATOR_PROFILE':
        return await this.updateCreatorProfile(data as CreatorProfileUpdate);
      case 'LOG_INTERACTION':
        return await this.logInteraction(data as InteractionData);
      case 'SYNC_CAMPAIGN_DATA':
        return await this.syncCampaignData(data as CampaignSyncData);
      default:
        return { message: 'Unknown CRM action' };
    }
  }

  private async updateCreatorProfile(data: CreatorProfileUpdate) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      profileId: data.creatorId,
      updatedFields: Object.keys(data.updates),
      lastUpdated: new Date().toISOString(),
      message: 'Creator profile updated successfully'
    };
  }

  private async logInteraction(data: InteractionData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      interactionId: `int_${Date.now()}`,
      type: data.type,
      participants: data.participants,
      loggedAt: new Date().toISOString(),
      message: 'Interaction logged in CRM'
    };
  }

  private async syncCampaignData(data: CampaignSyncData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      campaignId: data.campaignId,
      syncedRecords: Math.floor(Math.random() * 50 + 10),
      lastSync: new Date().toISOString(),
      message: 'Campaign data synchronized'
    };
  }
} 