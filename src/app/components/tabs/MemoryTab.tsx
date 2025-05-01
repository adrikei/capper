'use client';

import React from 'react';

interface MemoryTabProps {
  artifactSize: string;
  artifactMagnitude: string;
  totalWrites: number;
  retentionYears: string;
  replicationFactor: number;
  roundToNeat: boolean;
}

const magnitudeToBytes: Record<string, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
  PB: 1024 ** 5,
};

const MemoryTab: React.FC<MemoryTabProps> = ({
  artifactSize,
  artifactMagnitude,
  totalWrites,
  retentionYears,
  replicationFactor,
  roundToNeat,
}) => {
  const getArtifactSizeBytes = () => {
    const size = parseFloat(artifactSize) || 0;
    return size * magnitudeToBytes[artifactMagnitude] || 0;
  };

  const artifactSizeBytes = getArtifactSizeBytes();
  const totalStorage = artifactSizeBytes * totalWrites;
  const retention = parseFloat(retentionYears) || 1;
  const totalRetentionStorage = totalStorage * 365 * retention;

  const roundToNearestNeat = (num: number): number => {
    if (num < 1) return Math.ceil(num * 100) / 100;
    const magnitude = Math.floor(Math.log10(num));
    const base = Math.pow(10, magnitude);
    const normalized = num / base;
    const roundedNormalized = Math.ceil(normalized);
    return roundedNormalized * base;
  };

  const formatBytes = (bytes: number) => {
    let value = bytes;
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }
    if (roundToNeat) {
      value = roundToNearestNeat(value);
    }
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${units[unitIndex]}`;
  };

  const memoryForDaily = totalStorage * 0.2;
  const memoryForTotal = totalRetentionStorage * 0.2;

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Memory Planning</h2>
      <div className="space-y-4 max-w-md">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Memory for Daily Needs (20%)</h4>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatBytes(memoryForDaily)}</p>
          <p className="mt-2 text-sm text-gray-500">20% of daily storage needs</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Memory for Total Content (20%)</h4>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatBytes(memoryForTotal)}</p>
          <p className="mt-2 text-sm text-gray-500">20% of total content amount (retention period)</p>
        </div>
      </div>
    </div>
  );
};

export default MemoryTab; 