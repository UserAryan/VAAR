const fetch = require('node-fetch');

async function testWebhook() {
  const testData = {
    campaignName: "Test Campaign",
    objective: "Brand Awareness",
    budget: 1000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    platforms: ["Instagram", "YouTube"],
    targetAudience: "Test Audience",
    deliverables: "Test Deliverables",
    notes: "Test Notes",
    campaignId: `test_${Date.now()}`,
    timestamp: new Date().toISOString()
  };

  console.log('Testing n8n webhook with data:', JSON.stringify(testData, null, 2));

  try {
    const response = await fetch('https://vaar.app.n8n.cloud/webhook/campaign-create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'VAAR-Test/1.0'
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const text = await response.text();
    console.log('Response body:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testWebhook(); 