import { LucideIcon } from 'lucide-react';

export interface Task {
  id: number;
  type: string;
  payload: any;
  createdAt: string;
  status: 'pending' | 'assigned' | 'completed' | 'failed';
  completedAt?: string;
  error?: string;
}

export abstract class Agent {
  id: string;
  name: string;
  specialty: string;
  status: string;
  completedTasks: number;
  performance: number;
  currentTask: Task | null;
  icon: LucideIcon;

  constructor(id: string, name: string, specialty: string, icon: LucideIcon) {
    this.id = id;
    this.name = name;
    this.specialty = specialty;
    this.status = 'idle';
    this.completedTasks = 0;
    this.performance = 0;
    this.currentTask = null;
    this.icon = icon;
  }

  abstract canHandle(taskType: string): boolean;
  abstract processTask(task: Task): Promise<any>;
} 