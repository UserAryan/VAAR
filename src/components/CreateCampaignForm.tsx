import React, { useState } from 'react';
import { CreateCampaignData } from '@/types/campaign';

interface CreateCampaignFormProps {
  onSubmit: (data: CreateCampaignData) => void;
  isLoading: boolean;
}

export default function CreateCampaignForm({ onSubmit, isLoading }: CreateCampaignFormProps) {
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', JSON.stringify(formData, null, 2));
    
    // Validate required fields
    if (!formData.campaignName || !formData.objective || !formData.budget) {
      alert('Please fill in required fields: Campaign Name, Objective, and Budget');
      return;
    }

    const campaignData: CreateCampaignData = {
      campaignName: formData.campaignName,
      objective: formData.objective,
      budget: parseInt(formData.budget),
      startDate: formData.startDate,
      endDate: formData.endDate,
      platforms: formData.platforms.split(',').map(p => p.trim()),
      targetAudience: formData.targetAudience,
      deliverables: formData.deliverables,
      notes: formData.notes
    };

    console.log('Sending campaign data to parent:', JSON.stringify(campaignData, null, 2));
    try {
      await onSubmit(campaignData);
      console.log('Form submission completed successfully');
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Failed to create campaign: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
    
    // Reset form after submission
    setFormData({
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700">
            Campaign Name *
          </label>
          <input
            type="text"
            id="campaignName"
            name="campaignName"
            value={formData.campaignName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="objective" className="block text-sm font-medium text-gray-700">
            Objective *
          </label>
          <select
            id="objective"
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select an objective</option>
            <option value="Brand Awareness">Brand Awareness</option>
            <option value="Sales">Sales</option>
            <option value="Lead Generation">Lead Generation</option>
            <option value="Community Building">Community Building</option>
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
            Budget (₹) *
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            min="0"
            placeholder="Enter amount in rupees"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="platforms" className="block text-sm font-medium text-gray-700">
            Platforms *
          </label>
          <select
            id="platforms"
            name="platforms"
            value={formData.platforms}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select platforms</option>
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
            <option value="Both">Both (Instagram & YouTube)</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
            Target Audience *
          </label>
          <input
            type="text"
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            required
            placeholder="e.g., Fashion enthusiasts, 18-35"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700">
            Deliverables *
          </label>
          <input
            type="text"
            id="deliverables"
            name="deliverables"
            value={formData.deliverables}
            onChange={handleChange}
            required
            placeholder="e.g., 10 posts, 5 stories, 2 reels"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={async () => {
            console.log("🚀 Go button clicked");
            try {
              const response = await fetch('/api/create-campaign', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  campaignName: formData.campaignName,
                  objective: formData.objective,
                  budget: parseInt(formData.budget),
                  startDate: formData.startDate,
                  endDate: formData.endDate,
                  platforms: formData.platforms.split(',').map(p => p.trim()),
                  targetAudience: formData.targetAudience,
                  deliverables: formData.deliverables,
                  notes: formData.notes
                })
              });
              
              console.log("📥 Go button response status:", response.status);
              const result = await response.json();
              console.log("📥 Go button response:", result);
              
              if (!response.ok) {
                throw new Error(result.error || 'Failed to send to n8n');
              }
              
              alert("Campaign created! Please login to gmail using following details to simulate the test workflow:\n\nGmail id: vaarai25@gmail.com\nPass: Vaar_Ai2025");
            } catch (error) {
              console.error("❌ Go button error:", error);
              alert("Failed to send to n8n: " + (error instanceof Error ? error.message : 'Unknown error'));
            }
          }}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Go
        </button>
        {/* <button
          type="submit"
          disabled={isLoading}
          onClick={(e) => {
            console.log('Submit button clicked');
            if (isLoading) {
              e.preventDefault();
              console.log('Button is disabled, preventing submission');
              return;
            }
          }}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Campaign'}
        </button> */}
      </div>
    </form>
  );
} 