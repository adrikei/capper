'use client';

import React from 'react';

type Magnitude = '1' | '1K' | '1M' | '1B';

interface TrafficTabProps {
  dailyUsersNumber: string;
  dailyUsersMagnitude: Magnitude;
  avgReadRequests: string;
  avgWriteRequests: string;
  onDailyUsersNumberChange: (value: string) => void;
  onDailyUsersMagnitudeChange: (value: Magnitude) => void;
  onAvgReadRequestsChange: (value: string) => void;
  onAvgWriteRequestsChange: (value: string) => void;
}

const TrafficTab: React.FC<TrafficTabProps> = ({
  dailyUsersNumber,
  dailyUsersMagnitude,
  avgReadRequests,
  avgWriteRequests,
  onDailyUsersNumberChange,
  onDailyUsersMagnitudeChange,
  onAvgReadRequestsChange,
  onAvgWriteRequestsChange,
}) => {
  const calculateTotalRequests = () => {
    const baseUsers = parseInt(dailyUsersNumber) || 0;
    const magnitudeMultiplier = {
      '1': 1,
      '1K': 1000,
      '1M': 1000000,
      '1B': 1000000000,
    }[dailyUsersMagnitude];
    
    const users = baseUsers * magnitudeMultiplier;
    const reads = parseInt(avgReadRequests) || 0;
    const writes = parseInt(avgWriteRequests) || 0;

    return {
      totalReadRequests: users * reads,
      totalWriteRequests: users * writes,
    };
  };

  const { totalReadRequests, totalWriteRequests } = calculateTotalRequests();

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Traffic Planning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="dailyUsers" className="block text-sm font-medium text-gray-700">
              Daily Active Users
            </label>
            <div className="mt-1 flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  name="dailyUsersNumber"
                  id="dailyUsersNumber"
                  value={dailyUsersNumber}
                  onChange={(e) => onDailyUsersNumberChange(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter number"
                  min="0"
                  required
                />
              </div>
              <div className="w-24">
                <select
                  name="dailyUsersMagnitude"
                  id="dailyUsersMagnitude"
                  value={dailyUsersMagnitude}
                  onChange={(e) => onDailyUsersMagnitudeChange(e.target.value as Magnitude)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="1">Users</option>
                  <option value="1K">Thousands</option>
                  <option value="1M">Millions</option>
                  <option value="1B">Billions</option>
                </select>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter the estimated number of daily active users for your application.
            </p>
          </div>

          <div>
            <label htmlFor="avgReadRequests" className="block text-sm font-medium text-gray-700">
              Average Read Requests per User
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="avgReadRequests"
                id="avgReadRequests"
                value={avgReadRequests}
                onChange={(e) => onAvgReadRequestsChange(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter average read requests per user"
                min="0"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter the average number of read requests each user makes per day.
            </p>
          </div>

          <div>
            <label htmlFor="avgWriteRequests" className="block text-sm font-medium text-gray-700">
              Average Write Requests per User
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="avgWriteRequests"
                id="avgWriteRequests"
                value={avgWriteRequests}
                onChange={(e) => onAvgWriteRequestsChange(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter average write requests per user"
                min="0"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter the average number of write requests each user makes per day.
            </p>
          </div>
        </div>

        <div className="border-l border-gray-200 pl-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Results</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Total Read Requests</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {totalReadRequests.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Daily read requests across all users
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Total Write Requests</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {totalWriteRequests.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Daily write requests across all users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficTab; 