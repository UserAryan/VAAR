import { Agent, Task } from './base/Agent';
import { CreatorDiscoveryAgent } from './specialists/CreatorDiscoveryAgent';
import { OutreachAgent } from './specialists/OutreachAgent';
import { ContractAgent } from './specialists/ContractAgent';
import { PaymentAgent } from './specialists/PaymentAgent';
import { AnalyticsAgent } from './specialists/AnalyticsAgent';
import { CRMAgent } from './specialists/CRMAgent';

interface Campaign {
  id: string;
  title: string;
  brand: string;
  budget: number;
  targetCriteria: {
    niche: string;
    platform: string;
    minFollowers: number;
  };
  deliverables: string;
  timeline: string;
  status: 'active' | 'completed' | 'failed';
  createdAt: string;
  workflow?: any[];
  error?: string;
}

interface SystemStatus {
  agents: {
    id: string;
    name: string;
    specialty: string;
    status: string;
    completedTasks: number;
    performance: number;
    currentTask: string | null;
    icon: any;
  }[];
  campaigns: {
    active: number;
    completed: number;
    total: number;
  };
  tasks: {
    queue: number;
    completed: number;
    total: number;
  };
}

export class SupervisorAgent {
  private agents: {
    discovery: CreatorDiscoveryAgent;
    outreach: OutreachAgent;
    contract: ContractAgent;
    payment: PaymentAgent;
    analytics: AnalyticsAgent;
    crm: CRMAgent;
  };
  
  private taskQueue: Task[];
  private completedTasks: Task[];
  private activeCampaigns: Campaign[];
  private taskCounter: number;

  constructor() {
    this.agents = {
      discovery: new CreatorDiscoveryAgent(),
      outreach: new OutreachAgent(),
      contract: new ContractAgent(),
      payment: new PaymentAgent(),
      analytics: new AnalyticsAgent(),
      crm: new CRMAgent()
    };
    
    this.taskQueue = [];
    this.completedTasks = [];
    this.activeCampaigns = [];
    this.taskCounter = 0;
  }

  async createCampaign(campaignData: Omit<Campaign, 'id' | 'status' | 'createdAt' | 'workflow'>) {
    const campaignId = `campaign_${Date.now()}`;
    const campaign: Campaign = {
      id: campaignId,
      ...campaignData,
      status: 'active',
      createdAt: new Date().toISOString(),
      workflow: []
    };
    
    this.activeCampaigns.push(campaign);
    
    try {
      const workflowResult = await this.executeWorkflow(campaign);
      campaign.workflow = workflowResult;
      campaign.status = 'completed';
      
      return {
        campaignId,
        status: 'success',
        workflow: workflowResult,
        message: 'Campaign workflow completed successfully'
      };
    } catch (error) {
      campaign.status = 'failed';
      campaign.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  private async executeWorkflow(campaign: Campaign) {
    const workflow = [];
    
    try {
      // Step 1: Discover Creators
      const discoveryResult = await this.delegateTask('DISCOVER_CREATORS', {
        criteria: campaign.targetCriteria
      });
      workflow.push({ step: 'discovery', result: discoveryResult, status: 'completed' });

      // Step 2: Send Outreach
      const outreachResult = await this.delegateTask('SEND_OUTREACH', {
        creators: discoveryResult.result.creators.slice(0, 5), // Top 5 creators
        campaign: campaign
      });
      workflow.push({ step: 'outreach', result: outreachResult, status: 'completed' });

      // Step 3: Generate Contracts (for responded creators)
      const respondedCreators = Math.floor(outreachResult.result.summary.expectedResponses);
      if (respondedCreators > 0) {
        const contractResult = await this.delegateTask('GENERATE_CONTRACT', {
          dealDetails: {
            campaign: campaign.title,
            brand: campaign.brand,
            creator: 'Selected Creator',
            deliverables: campaign.deliverables,
            amount: campaign.budget / respondedCreators,
            timeline: campaign.timeline,
            milestones: ['50% upfront', '50% on completion']
          }
        });
        workflow.push({ step: 'contract', result: contractResult, status: 'completed' });

        // Step 4: Process Payment
        const paymentResult = await this.delegateTask('PROCESS_PAYMENT', {
          paymentDetails: {
            amount: campaign.budget * 0.5, // 50% upfront
            milestones: [
              { description: 'Upfront payment', amount: campaign.budget * 0.5, status: 'completed' },
              { description: 'Completion payment', amount: campaign.budget * 0.5, status: 'pending' }
            ]
          }
        });
        workflow.push({ step: 'payment', result: paymentResult, status: 'completed' });
      }

      // Step 5: Analytics
      const analyticsResult = await this.delegateTask('ANALYZE_PERFORMANCE', {
        campaignId: campaign.id
      });
      workflow.push({ step: 'analytics', result: analyticsResult, status: 'completed' });

      // Step 6: Update CRM
      const crmResult = await this.delegateTask('UPDATE_CRM', {
        action: 'SYNC_CAMPAIGN_DATA',
        data: { campaignId: campaign.id }
      });
      workflow.push({ step: 'crm', result: crmResult, status: 'completed' });

      return workflow;
    } catch (error) {
      console.error('Workflow error:', error);
      throw error;
    }
  }

  private async delegateTask(taskType: string, payload: any) {
    const agent = this.findAgentForTask(taskType);
    
    if (!agent) {
      throw new Error(`No agent available for task: ${taskType}`);
    }

    const task: Task = {
      id: ++this.taskCounter,
      type: taskType,
      payload,
      createdAt: new Date().toISOString(),
      status: 'assigned'
    };

    this.taskQueue.push(task);

    try {
      const result = await agent.processTask(task);
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      
      this.completedTasks.push(task);
      this.taskQueue = this.taskQueue.filter(t => t.id !== task.id);
      
      return result;
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  private findAgentForTask(taskType: string): Agent | undefined {
    return Object.values(this.agents).find(agent => agent.canHandle(taskType));
  }

  getSystemStatus(): SystemStatus {
    return {
      agents: Object.values(this.agents).map(agent => ({
        id: agent.id,
        name: agent.name,
        specialty: agent.specialty,
        status: agent.status,
        completedTasks: agent.completedTasks,
        performance: agent.performance,
        currentTask: agent.currentTask?.type || null,
        icon: agent.icon
      })),
      campaigns: {
        active: this.activeCampaigns.filter(c => c.status === 'active').length,
        completed: this.activeCampaigns.filter(c => c.status === 'completed').length,
        total: this.activeCampaigns.length
      },
      tasks: {
        queue: this.taskQueue.length,
        completed: this.completedTasks.length,
        total: this.taskCounter
      }
    };
  }
} 