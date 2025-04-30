'use client';

import React, { useState } from 'react';

type Magnitude = '1' | '1K' | '1M' | '1B';
type ReadWriteRatio = '10:1' | '50:1' | '100:1';

interface TrafficTabProps {
  dailyUsersNumber: string;
  dailyUsersMagnitude: Magnitude;
  readWriteRatio: ReadWriteRatio;
  onDailyUsersNumberChange: (value: string) => void;
  onDailyUsersMagnitudeChange: (value: Magnitude) => void;
  onReadWriteRatioChange: (value: ReadWriteRatio) => void;
}

const TrafficTab: React.FC<TrafficTabProps> = ({
  dailyUsersNumber,
  dailyUsersMagnitude,
  readWriteRatio,
  onDailyUsersNumberChange,
  onDailyUsersMagnitudeChange,
  onReadWriteRatioChange,
}) => {
  const [roundToNeat, setRoundToNeat] = useState(false);

  const roundToNearestNeat = (num: number): number => {
    if (num < 1) return Math.ceil(num * 100) / 100;
    
    const magnitude = Math.floor(Math.log10(num));
    const base = Math.pow(10, magnitude);
    const normalized = num / base;
    
    // Round to nearest whole number
    const roundedNormalized = Math.ceil(normalized);
    return roundedNormalized * base;
  };

  const formatNumber = (num: number) => {
    if (roundToNeat) {
      const rounded = roundToNearestNeat(num);
      return rounded.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    
    if (num < 1) {
      return num.toFixed(2);
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const calculateTotalRequests = () => {
    const baseUsers = parseInt(dailyUsersNumber) || 0;
    const magnitudeMultiplier = {
        '1': 1,
        '1K': 1000,
        '1M': 1000000,
        '1B': 1000000000,
    }[dailyUsersMagnitude];
    
    const users = baseUsers * magnitudeMultiplier;
    const [reads, writes] = readWriteRatio.split(':').map(Number);
    const writeMultiplier = 1 / writes;

    // Calculate total requests without applying neat rounding
    const dailyReads = Math.round(users * reads * writeMultiplier);
    const dailyWrites = Math.round(users * writeMultiplier);

    // Determine seconds in day
    const secondsInDay = 24 * 60 * 60;

    // Calculate per-second rates without neat rounding
    const readsPerSecond = Math.round(dailyReads / secondsInDay);
    const writesPerSecond = Math.round(dailyWrites / secondsInDay);

    // Calculate peak rates without neat rounding
    const peakTimeSeconds = Math.round(secondsInDay * 0.2); // Convert decimal fraction back to whole number
    const peakReadsPerSecond = Math.round((dailyReads * 0.8) / peakTimeSeconds);
    const peakWritesPerSecond = Math.round((dailyWrites * 0.8) / peakTimeSeconds);

    return {
        totalReadRequests: dailyReads,
        totalWriteRequests: dailyWrites,
        readsPerSecond,
        writesPerSecond,
        peakReadsPerSecond,
        peakWritesPerSecond,
    };
  };

  const { 
    totalReadRequests, 
    totalWriteRequests, 
    readsPerSecond, 
    writesPerSecond,
    peakReadsPerSecond,
    peakWritesPerSecond
  } = calculateTotalRequests();

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
            <label className="block text-sm font-medium text-gray-700">
              Read/Write Ratio
            </label>
            <div className="mt-1 flex gap-2">
              {(['10:1', '50:1', '100:1'] as ReadWriteRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => onReadWriteRatioChange(ratio)}
                  className={`
                    flex-1 py-2 px-4 border rounded-md text-sm font-medium
                    ${
                      readWriteRatio === ratio
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {ratio}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Select the ratio of read to write requests.
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="roundToNeat"
              checked={roundToNeat}
              onChange={(e) => setRoundToNeat(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="roundToNeat" className="ml-2 block text-sm text-gray-700">
              Round numbers to nearest neat value
            </label>
          </div>
        </div>

        <div className="border-l border-gray-200 pl-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Results</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Total Read Requests</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatNumber(totalReadRequests)}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Daily read requests across all users
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Total Write Requests</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatNumber(totalWriteRequests)}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Daily write requests across all users
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Read Requests per Second</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatNumber(readsPerSecond)}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Average read requests per second
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Write Requests per Second</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatNumber(writesPerSecond)}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Average write requests per second
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Peak Read Requests per Second</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatNumber(peakReadsPerSecond)}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Peak read requests (80% of traffic in 20% of time)
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Peak Write Requests per Second</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatNumber(peakWritesPerSecond)}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Peak write requests (80% of traffic in 20% of time)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficTab; 