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
      'crm_agent',
      'CRM Data Agent',
      'data_management',
      Database
    );
  }

  canHandle(taskType: string): boolean {
    return ['UPDATE_CRM', 'MANAGE_RELATIONSHIPS', 'DATA_SYNC'].includes(taskType);
  }

  async processTask(task: Task): Promise<any> {
    this.status = 'working';
    this.currentTask = task;

    try {
      const { action, data } = task.payload as { 
        action: 'UPDATE_CREATOR_PROFILE' | 'LOG_INTERACTION' | 'SYNC_CAMPAIGN_DATA',
        data: CreatorProfileUpdate | InteractionData | CampaignSyncData
      };
      
      let result;
      switch (action) {
        case 'UPDATE_CREATOR_PROFILE':
          result = await this.updateCreatorProfile(data as CreatorProfileUpdate);
          break;
        case 'LOG_INTERACTION':
          result = await this.logInteraction(data as InteractionData);
          break;
        case 'SYNC_CAMPAIGN_DATA':
          result = await this.syncCampaignData(data as CampaignSyncData);
          break;
        default:
          result = { message: 'Unknown CRM action' };
      }

      this.status = 'idle';
      this.currentTask = null;
      this.completedTasks++;
      this.performance = Math.floor(Math.random() * 20 + 80);

      return result;
    } catch (error) {
      this.status = 'error';
      this.currentTask = null;
      throw error;
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