import { CreateCampaignData } from '@/types/campaign';

export class SupervisorAgent {
  async createCampaign(campaignData: CreateCampaignData) {
    try {
      console.log("🔍 Supervisor: Starting campaign creation");
      console.log("📦 Supervisor: Campaign data:", JSON.stringify(campaignData, null, 2));
      
      // First test the API endpoint
      console.log("🧪 Testing API endpoint...");
      const testResponse = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true })
      });
      
      console.log("📥 Test response status:", testResponse.status);
      const testResult = await testResponse.json();
      console.log("📥 Test response:", testResult);
      
      // Now try the actual campaign creation
      const apiUrl = '/api/create-campaign';
      console.log("🚀 Supervisor: Sending to", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData)
      });

      console.log("📥 Supervisor: Response status:", response.status);
      console.log("📥 Supervisor: Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Supervisor: Error response:", error);
        throw new Error(error.error || 'Failed to create campaign');
      }

      const result = await response.json();
      console.log("✅ Supervisor: Success response:", JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
      console.error("❌ Supervisor: Campaign creation failed:", error);
      throw error;
    }
  }
} 