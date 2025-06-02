'use client';

import React from 'react';
import { Campaign } from '@/types/campaign';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface CampaignAnalyticsProps {
  campaign: Campaign;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function CampaignAnalytics({ campaign }: CampaignAnalyticsProps) {
  if (!campaign.analytics) return null;

  const { engagement, demographics, timeline } = campaign.analytics;

  // Prepare data for demographics charts
  const ageData = Object.entries(demographics.ageGroups).map(([age, value]) => ({
    name: age,
    value
  }));

  const genderData = Object.entries(demographics.gender).map(([gender, value]) => ({
    name: gender,
    value
  }));

  const locationData = Object.entries(demographics.locations).map(([location, value]) => ({
    name: location,
    value
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{campaign.campaignName}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          campaign.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : campaign.status === 'completed'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {campaign.status}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Engagement Rate</p>
          <p className="text-2xl font-semibold text-gray-900">{engagement.engagementRate}%</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Growth Rate</p>
          <p className="text-2xl font-semibold text-gray-900">{engagement.growthRate}%</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="text-2xl font-semibold text-gray-900">{engagement.conversionRate}%</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">ROI</p>
          <p className="text-2xl font-semibold text-gray-900">{engagement.roi}x</p>
        </div>
      </div>

      {/* Engagement Timeline */}
      <div className="h-80">
        <h4 className="text-md font-medium text-gray-900 mb-4">Engagement Over Time</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="engagement" stroke="#8884d8" />
            <Line type="monotone" dataKey="reach" stroke="#82ca9d" />
            <Line type="monotone" dataKey="conversions" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64">
          <h4 className="text-md font-medium text-gray-900 mb-4">Age Distribution</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64">
          <h4 className="text-md font-medium text-gray-900 mb-4">Gender Distribution</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64">
          <h4 className="text-md font-medium text-gray-900 mb-4">Geographic Distribution</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 