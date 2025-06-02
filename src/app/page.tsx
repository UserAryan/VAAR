'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, Bot, User, CheckCircle, Clock, AlertCircle, Search, 
  Users, Mail, FileText, CreditCard, BarChart3, Database,
  Youtube, Instagram, MessageSquare, DollarSign, Eye
} from 'lucide-react';
import { SupervisorAgent } from '../agents/SupervisorAgent';
import { CreateCampaignData, Campaign } from '@/types/campaign';
import CampaignAnalytics from '@/components/CampaignAnalytics';
import CreateCampaignForm from '../components/CreateCampaignForm';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface WorkflowStep {
  step: string;
  result: {
    message?: string;
    result?: any;
  };
}

interface SystemStatus {
  campaigns: { active: number; total: number };
  agents: { online: number; total: number };
}

// Mock campaign data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    campaignName: 'Summer Collection Launch',
    objective: 'Brand Awareness',
    budget: 5000,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    platforms: ['Instagram', 'YouTube'],
    targetAudience: 'Fashion enthusiasts, 18-35',
    deliverables: '10 posts, 5 stories, 2 reels',
    status: 'completed',
    createdAt: '2024-03-15T10:00:00Z',
    analytics: {
      engagement: {
        likes: 15000,
        comments: 2500,
        shares: 3000,
        reach: 50000,
        impressions: 75000,
        engagementRate: 4.2,
        growthRate: 12.5,
        conversionRate: 3.8,
        roi: 2.5
      },
      demographics: {
        ageGroups: {
          '18-24': 35,
          '25-34': 45,
          '35-44': 15,
          '45+': 5
        },
        gender: {
          male: 40,
          female: 60
        },
        locations: {
          'North America': 45,
          'Europe': 30,
          'Asia': 15,
          'Other': 10
        }
      },
      timeline: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 5, i + 1).toISOString().split('T')[0],
        engagement: Math.floor(Math.random() * 1000) + 500,
        reach: Math.floor(Math.random() * 5000) + 2000,
        conversions: Math.floor(Math.random() * 100) + 50
      }))
    }
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
    status: 'completed',
    createdAt: '2024-03-14T15:30:00Z',
    analytics: {
      engagement: {
        likes: 20000,
        comments: 3500,
        shares: 4500,
        reach: 75000,
        impressions: 100000,
        engagementRate: 5.1,
        growthRate: 15.2,
        conversionRate: 4.5,
        roi: 3.2
      },
      demographics: {
        ageGroups: {
          '18-24': 25,
          '25-34': 50,
          '35-44': 20,
          '45+': 5
        },
        gender: {
          male: 45,
          female: 55
        },
        locations: {
          'North America': 50,
          'Europe': 25,
          'Asia': 20,
          'Other': 5
        }
      },
      timeline: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 10, i + 15).toISOString().split('T')[0],
        engagement: Math.floor(Math.random() * 1200) + 600,
        reach: Math.floor(Math.random() * 6000) + 3000,
        conversions: Math.floor(Math.random() * 150) + 75
      }))
    }
  }
];

export default function Home() {
  const { data: session } = useSession();
  const [supervisor] = useState(() => new SupervisorAgent());
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [campaignResults, setCampaignResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState<string | null>(null);

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    campaignName: '',
    objective: '',
    budget: '',
    startDate: '',
    endDate: '',
    platforms: '',
    targetAudience: '',
    deliverables: '',
    notes: ''
  });

  // Update system status periodically
  useEffect(() => {
    const updateStatus = () => {
      try {
        const status = supervisor.getSystemStatus();
        setSystemStatus(status);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update system status');
        console.error('Error updating status:', err);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 2000);
    return () => clearInterval(interval);
  }, [supervisor]);

  const handleCreateCampaign = async () => {
    // Get form data from the CreateCampaignForm component
    const form = document.querySelector('form');
    if (!form) return;

    const formData = new FormData(form);
    const campaignName = formData.get('campaignName') as string;
    const objective = formData.get('objective') as string;
    const budget = formData.get('budget') as string;

    if (!campaignName || !objective || !budget) {
      alert('Please fill in required fields: Campaign Name, Objective, and Budget');
      return;
    }

    setIsRunning(true);
    try {
      const campaignData: CreateCampaignData = {
        campaignName,
        objective,
        budget: parseInt(budget),
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
        platforms: (formData.get('platforms') as string).split(',').map(p => p.trim()),
        targetAudience: formData.get('targetAudience') as string,
        deliverables: formData.get('deliverables') as string,
        notes: formData.get('notes') as string
      };

      const result = await supervisor.createCampaign(campaignData);
      setCampaignResults(prev => [result, ...prev]);
      
      // Reset form
      form.reset();

      // Show success alert with login details
      alert("Campaign created! Please login to gmail using following details to simulate the test workflow:\n\nGmail id: vaarai25@gmail.com\nPass: Vaar_Ai2025");
    } catch (error) {
      console.error('Campaign creation failed:', error);
      alert('Campaign creation failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsRunning(false);
    }
  };

  const renderAgentCard = (agent: any) => {
    const IconComponent = agent.icon;
    const statusColor = agent.status === 'working' ? 'text-blue-500' : 
                       agent.status === 'error' ? 'text-red-500' : 'text-green-500';
    
    return (
      <div key={agent.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <IconComponent className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{agent.specialty.replace('_', ' ')}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 ${statusColor}`}>
            {agent.status === 'working' ? <Clock className="w-4 h-4" /> : 
             agent.status === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            <span className="text-sm font-medium capitalize">{agent.status}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tasks Completed:</span>
            <span className="font-medium">{agent.completedTasks}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Performance:</span>
            <span className="font-medium">{agent.performance}%</span>
          </div>
          {agent.currentTask && (
            <div className="text-sm">
              <span className="text-gray-600">Current Task:</span>
              <p className="text-blue-600 truncate mt-1">{agent.currentTask}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWorkflowStep = (step: WorkflowStep, index: number) => {
    const stepIcons: Record<string, any> = {
      discovery: Search,
      outreach: Mail,
      contract: FileText,
      payment: CreditCard,
      analytics: BarChart3,
      crm: Database
    };
    
    const StepIcon = stepIcons[step.step] || Bot;
    
    return (
      <div key={index} className="flex items-start space-x-3 pb-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <StepIcon className="w-4 h-4 text-green-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 capitalize">
            {step.step.replace('_', ' ')} Agent
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            {step.result.message || 'Task completed successfully'}
          </p>
          {step.result.result && (
            <div className="mt-2 text-xs text-gray-400">
              {typeof step.result.result === 'object' ? 
                JSON.stringify(step.result.result, null, 2).substring(0, 100) + '...' :
                step.result.result.toString().substring(0, 100) + '...'
              }
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">InfluencerFlow AI</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {systemStatus && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{systemStatus.campaigns.active}</span> Active Campaigns
                </div>
              )}
              {!session && (
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Create Campaign
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`${
                activeTab === 'results'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Campaign Results
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'dashboard' ? (
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Total Campaigns</h3>
                      <p className="text-2xl font-semibold text-gray-900">{mockCampaigns.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Total Budget</h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        ₹{mockCampaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Total Reach</h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {mockCampaigns.reduce((sum, c) => sum + (c.analytics?.engagement.reach || 0), 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Eye className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Total Impressions</h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {mockCampaigns.reduce((sum, c) => sum + (c.analytics?.engagement.impressions || 0), 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Campaigns */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Campaigns</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {mockCampaigns.map(campaign => (
                    <div key={campaign.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{campaign.campaignName}</h4>
                          <p className="text-sm text-gray-500">{campaign.objective}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-500">
                            Budget: ₹{campaign.budget.toLocaleString('en-IN')}
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            campaign.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : campaign.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'create' ? (
            <div className="bg-white shadow rounded-lg p-6">
              <CreateCampaignForm onSubmit={handleCreateCampaign} isLoading={isRunning} />
            </div>
          ) : (
            <div className="space-y-6">
              {mockCampaigns.map(campaign => (
                <CampaignAnalytics key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 