'use client';

import React from 'react';
import { useState } from 'react';

interface TrafficTabProps {
  // Add any props if needed
}

const TrafficTab: React.FC<TrafficTabProps> = () => {
  const [dailyUsers, setDailyUsers] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Daily Users:', dailyUsers);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Traffic Planning</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="dailyUsers" className="block text-sm font-medium text-gray-700">
            Daily Active Users
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="dailyUsers"
              id="dailyUsers"
              value={dailyUsers}
              onChange={(e) => setDailyUsers(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter number of daily active users"
              min="0"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter the estimated number of daily active users for your application.
          </p>
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Calculate
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrafficTab; 