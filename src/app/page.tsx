'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, Bot, User, CheckCircle, Clock, AlertCircle, Search, 
  Users, Mail, FileText, CreditCard, BarChart3, Database,
  Youtube, Instagram, MessageSquare, DollarSign, Eye
} from 'lucide-react';
import { SupervisorAgent } from '../agents/SupervisorAgent';

export default function InfluencerFlowMVP() {
  const [supervisor] = useState(() => new SupervisorAgent());
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [campaignResults, setCampaignResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    brand: '',
    budget: '',
    niche: '',
    platform: '',
    minFollowers: '',
    deliverables: '',
    timeline: ''
  });

  // Update system status periodically
  useEffect(() => {
    const updateStatus = () => {
      const status = supervisor.getSystemStatus();
      setSystemStatus(status);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 2000);
    return () => clearInterval(interval);
  }, [supervisor]);

  const handleCreateCampaign = async () => {
    if (!campaignForm.title || !campaignForm.brand || !campaignForm.budget) {
      alert('Please fill in required fields: Title, Brand, and Budget');
      return;
    }

    setIsRunning(true);
    try {
      const campaignData = {
        title: campaignForm.title,
        brand: campaignForm.brand,
        budget: parseInt(campaignForm.budget),
        targetCriteria: {
          niche: campaignForm.niche,
          platform: campaignForm.platform,
          minFollowers: parseInt(campaignForm.minFollowers) || 1000
        },
        deliverables: campaignForm.deliverables || 'Social media posts',
        timeline: campaignForm.timeline || '2 weeks'
      };

      const result = await supervisor.createCampaign(campaignData);
      setCampaignResults(prev => [result, ...prev]);
      
      // Reset form
      setCampaignForm({
        title: '',
        brand: '',
        budget: '',
        niche: '',
        platform: '',
        minFollowers: '',
        deliverables: '',
        timeline: ''
      });
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

  const renderWorkflowStep = (step: any, index: number) => {
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
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">InfluencerFlow AI</h1>
                <p className="text-sm text-gray-500">Multi-Agent Influencer Marketing Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {systemStatus && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{systemStatus.campaigns.active}</span> Active Campaigns
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'campaign', name: 'Create Campaign', icon: Send },
              { id: 'results', name: 'Campaign Results', icon: Eye }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* System Overview */}
            {systemStatus && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Bot className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Agents</p>
                      <p className="text-2xl font-semibold text-gray-900">{systemStatus.agents.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                      <p className="text-2xl font-semibold text-gray-900">{systemStatus.tasks.completed}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Queue</p>
                      <p className="text-2xl font-semibold text-gray-900">{systemStatus.tasks.queue}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Campaigns</p>
                      <p className="text-2xl font-semibold text-gray-900">{systemStatus.campaigns.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Agents */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">AI Agent Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemStatus?.agents.map(renderAgentCard)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaign' && (
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Create New Campaign</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      value={campaignForm.title}
                      onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Summer Product Launch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      value={campaignForm.brand}
                      onChange={(e) => setCampaignForm({...campaignForm, brand: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Brand"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget (USD) *
                    </label>
                    <input
                      type="number"
                      value={campaignForm.budget}
                      onChange={(e) => setCampaignForm({...campaignForm, budget: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Niche
                    </label>
                    <select
                      value={campaignForm.niche}
                      onChange={(e) => setCampaignForm({...campaignForm, niche: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Niche</option>
                      <option value="Tech">Tech</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Lifestyle">Lifestyle</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      value={campaignForm.platform}
                      onChange={(e) => setCampaignForm({...campaignForm, platform: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Platform</option>
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Followers
                    </label>
                    <input
                      type="number"
                      value={campaignForm.minFollowers}
                      onChange={(e) => setCampaignForm({...campaignForm, minFollowers: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deliverables
                  </label>
                  <textarea
                    value={campaignForm.deliverables}
                    onChange={(e) => setCampaignForm({...campaignForm, deliverables: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1 Instagram post, 3 Instagram stories, 1 YouTube video"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <input
                    type="text"
                    value={campaignForm.timeline}
                    onChange={(e) => setCampaignForm({...campaignForm, timeline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2 weeks"
                  />
                </div>

                <button
                  onClick={handleCreateCampaign}
                  disabled={isRunning}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Campaign...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Launch Campaign</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Campaign Results</h2>
            {campaignResults.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No campaigns created yet. Create your first campaign to see results here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {campaignResults.map((result, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Campaign: {result.campaignId}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    
                    {result.workflow && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Workflow Execution</h4>
                        <div className="space-y-2">
                          {result.workflow.map((step, stepIndex) => 
                            renderWorkflowStep(step, stepIndex)
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 