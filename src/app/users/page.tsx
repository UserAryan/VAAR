import { db } from '@/lib/db';
import React from 'react';
import SearchUsers from './SearchUsers';

export default async function UsersPage() {
  // Fetch all users with their profiles
  const users = await db.user.findMany({
    include: { profile: true }
  });

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Users</h1>
      </div>

      <div className="mb-8">
        <SearchUsers />
      </div>

      <div className="space-y-4">
        {users.map((user: any) => (
          <div key={user.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">{user.name}</div>
                <div className="text-gray-500 text-sm">{user.email}</div>
                <div className="text-xs text-blue-600 font-medium mt-1">{user.type}</div>
              </div>
              {user.profile && (
                <div className="ml-4 text-right">
                  <div className="text-gray-700 text-sm">{user.profile.bio}</div>
                  <div className="text-xs text-gray-400 mt-1">Niches: {user.profile.niches.join(', ')}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 