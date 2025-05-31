import { IconType } from 'lucide-react';

export interface Task {
  id: number;
  type: string;
  payload: any;
  createdAt: string;
  status: 'assigned' | 'completed' | 'failed';
  completedAt?: string;
  error?: string;
}

export class Agent {
  id: string;
  name: string;
  specialty: string;
  capabilities: string[];
  icon: IconType;
  status: 'idle' | 'working' | 'error';
  currentTask: Task | null;
  completedTasks: number;
  performance: number;

  constructor(name: string, specialty: string, capabilities: string[], icon: IconType) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.name = name;
    this.specialty = specialty;
    this.capabilities = capabilities;
    this.icon = icon;
    this.status = 'idle';
    this.currentTask = null;
    this.completedTasks = 0;
    this.performance = Math.floor(Math.random() * 20 + 80); // 80-100%
  }

  async processTask(task: Task) {
    this.status = 'working';
    this.currentTask = task;
    
    console.log(`${this.name} started processing: ${task.description}`);
    
    try {
      const processingTime = this.getProcessingTime(task.type);
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      const result = await this.executeTask(task);
      
      this.status = 'idle';
      this.currentTask = null;
      this.completedTasks++;
      
      return {
        taskId: task.id,
        agentId: this.id,
        agentName: this.name,
        result,
        processingTime,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
    } catch (error) {
      this.status = 'error';
      this.currentTask = null;
      throw error;
    }
  }

  getProcessingTime(taskType: string): number {
    const baseTimes: Record<string, number> = {
      'DISCOVER_CREATORS': 2000,
      'SEND_OUTREACH': 1500,
      'GENERATE_CONTRACT': 2500,
      'PROCESS_PAYMENT': 1000,
      'ANALYZE_PERFORMANCE': 3000,
      'UPDATE_CRM': 800
    };
    return baseTimes[taskType] || 1500;
  }

  canHandle(taskType: string): boolean {
    return this.capabilities.includes(taskType);
  }

  async executeTask(task: Task): Promise<any> {
    return `${this.name} processed: ${task.description}`;
  }
} 