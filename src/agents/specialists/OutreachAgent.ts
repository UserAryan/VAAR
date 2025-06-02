import { Mail } from 'lucide-react';
import { Agent, Task } from '../base/Agent';

interface Creator {
  id: string;
  name: string;
  platform: string;
  niche: string;
  followers: number;
  rate: number;
}

interface Campaign {
  title: string;
  brand: string;
  budget: number;
  deliverables: string;
  timeline: string;
}

interface OutreachMessage {
  subject: string;
  body: string;
  personalizedElements: string[];
}

export class OutreachAgent extends Agent {
  constructor() {
    super(
      'outreach_agent',
      'AI Outreach Agent',
      'outreach_automation',
      Mail
    );
  }

  canHandle(taskType: string): boolean {
    return ['SEND_OUTREACH', 'NEGOTIATE_DEALS', 'MULTILINGUAL_COMM'].includes(taskType);
  }

  async processTask(task: Task): Promise<any> {
    this.status = 'working';
    this.currentTask = task;

    try {
      const { creators, campaign } = task.payload as { creators: Creator[], campaign: Campaign };
      
      const outreachResults = [];
      
      for (const creator of creators) {
        // Generate personalized outreach message
        const message = await this.generateOutreachMessage(creator, campaign);
        
        // Simulate sending email
        await this.sendEmail(creator, message);
        
        outreachResults.push({
          creatorId: creator.id,
          creatorName: creator.name,
          status: Math.random() > 0.3 ? 'sent' : 'failed',
          message: message.subject,
          sentAt: new Date().toISOString()
        });
      }

      const sentCount = outreachResults.filter(r => r.status === 'sent').length;
      
      this.status = 'idle';
      this.currentTask = null;
      this.completedTasks++;
      this.performance = Math.floor(Math.random() * 20 + 80);

      return {
        outreachResults,
        summary: {
          total: creators.length,
          sent: sentCount,
          failed: creators.length - sentCount,
          expectedResponses: Math.floor(sentCount * 0.15) // 15% response rate
        },
        message: `Outreach sent to ${sentCount}/${creators.length} creators`
      };
    } catch (error) {
      this.status = 'error';
      this.currentTask = null;
      throw error;
    }
  }

  private async generateOutreachMessage(creator: Creator, campaign: Campaign): Promise<OutreachMessage> {
    // Simulate GPT-4 API call for personalized outreach
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      subject: `Collaboration Opportunity - ${campaign.title}`,
      body: `Hi ${creator.name},\n\nI hope this email finds you well! I came across your ${creator.platform} content and was impressed by your ${creator.niche} expertise.\n\nWe'd love to collaborate with you on our ${campaign.title} campaign. Budget: $${creator.rate}\n\nBest regards,\nInfluencerFlow AI`,
      personalizedElements: [`${creator.niche} expertise`, `${creator.followers} followers`]
    };
  }

  private async sendEmail(creator: Creator, message: OutreachMessage): Promise<void> {
    // Simulate Gmail API call
    console.log(`Sending email to ${creator.name}:`, message.subject);
    return new Promise(resolve => setTimeout(resolve, 200));
  }
} 