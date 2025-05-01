'use client';

import React from 'react';

type SizeMagnitude = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

interface BandwidthTabProps {
  writesPerSecond: number;
  readsPerSecond: number;
  peakWritesPerSecond: number;
  peakReadsPerSecond: number;
  artifactSize: string;
  artifactMagnitude: string;
  roundToNeat: boolean;
  onRoundToNeatChange: (value: boolean) => void;
}

const magnitudeToBytes: Record<SizeMagnitude, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
  PB: 1024 ** 5,
};

const BandwidthTab: React.FC<BandwidthTabProps> = ({
  writesPerSecond,
  readsPerSecond,
  peakWritesPerSecond,
  peakReadsPerSecond,
  artifactSize,
  artifactMagnitude,
  roundToNeat,
  onRoundToNeatChange,
}) => {
  const getArtifactSizeBytes = () => {
    const size = parseFloat(artifactSize) || 0;
    return size * magnitudeToBytes[artifactMagnitude as SizeMagnitude];
  };

  const roundToNearestNeat = (num: number): number => {
    if (num < 1) return Math.ceil(num * 100) / 100;
    const magnitude = Math.floor(Math.log10(num));
    const base = Math.pow(10, magnitude);
    const normalized = num / base;
    const roundedNormalized = Math.ceil(normalized);
    return roundedNormalized * base;
  };

  const artifactSizeBytes = getArtifactSizeBytes();

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${roundToNeat ? roundToNearestNeat(bytes) : bytes} B`;
    const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
    let value = bytes / 1024;
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

  // Bandwidth in bytes/sec
  const writeBandwidth = writesPerSecond * artifactSizeBytes;
  const readBandwidth = readsPerSecond * artifactSizeBytes;
  const peakWriteBandwidth = peakWritesPerSecond * artifactSizeBytes;
  const peakReadBandwidth = peakReadsPerSecond * artifactSizeBytes;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Bandwidth Planning</h2>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="roundToNeatBandwidth"
            checked={roundToNeat}
            onChange={(e) => onRoundToNeatChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="roundToNeatBandwidth" className="ml-2 block text-sm text-gray-700">
            Round numbers to nearest neat value
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Incoming (Write) Bandwidth</h4>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{formatBytes(writeBandwidth)}/s</p>
            <p className="mt-2 text-sm text-gray-500">Average incoming bandwidth per second</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Outgoing (Read) Bandwidth</h4>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{formatBytes(readBandwidth)}/s</p>
            <p className="mt-2 text-sm text-gray-500">Average outgoing bandwidth per second</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Peak Incoming (Write) Bandwidth</h4>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{formatBytes(peakWriteBandwidth)}/s</p>
            <p className="mt-2 text-sm text-gray-500">Peak incoming bandwidth per second (80% of traffic in 20% of time)</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Peak Outgoing (Read) Bandwidth</h4>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{formatBytes(peakReadBandwidth)}/s</p>
            <p className="mt-2 text-sm text-gray-500">Peak outgoing bandwidth per second (80% of traffic in 20% of time)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BandwidthTab; 