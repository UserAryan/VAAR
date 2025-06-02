import { db } from '@/lib/db';
import React from 'react';
import SearchUsers from './SearchUsers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function UsersPage() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        createdAt: true,
        profile: {
          select: {
            bio: true,
            avatar: true,
            niches: true,
          },
        },
      },
    });

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user.id} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Type: {user.type}</p>
              {user.profile && (
                <div className="mt-2">
                  <p className="text-sm">{user.profile.bio}</p>
                  {user.profile.niches && user.profile.niches.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {user.profile.niches.map((niche) => (
                        <span
                          key={niche}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                        >
                          {niche}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            Unable to load users. Please try again later.
          </p>
        </div>
      </div>
    );
  }
} 