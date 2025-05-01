'use client';

import React from 'react';

interface StorageTabProps {
  totalWrites: number;
  writesPerSecond: number;
  peakWritesPerSecond: number;
  artifactSize: string;
  artifactMagnitude: string;
  retentionYears: string;
  roundToNeat: boolean;
  replicationFactor: number;
  onArtifactSizeChange: (value: string) => void;
  onArtifactMagnitudeChange: (value: string) => void;
  onRetentionYearsChange: (value: string) => void;
  onRoundToNeatChange: (value: boolean) => void;
  onReplicationFactorChange: (value: number) => void;
}

type SizeMagnitude = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

const magnitudeToBytes: Record<SizeMagnitude, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
  PB: 1024 ** 5,
};

const StorageTab: React.FC<StorageTabProps> = ({
  totalWrites,
  writesPerSecond,
  peakWritesPerSecond,
  artifactSize,
  artifactMagnitude,
  retentionYears,
  roundToNeat,
  replicationFactor,
  onArtifactSizeChange,
  onArtifactMagnitudeChange,
  onRetentionYearsChange,
  onRoundToNeatChange,
  onReplicationFactorChange,
}) => {
  const getArtifactSizeBytes = () => {
    const size = parseFloat(artifactSize) || 0;
    return size * magnitudeToBytes[artifactMagnitude as SizeMagnitude];
  };

  const artifactSizeBytes = getArtifactSizeBytes();
  const totalStorage = artifactSizeBytes * totalWrites;
  const perSecondStorage = artifactSizeBytes * writesPerSecond;
  const peakStorage = artifactSizeBytes * peakWritesPerSecond;
  const retention = parseFloat(retentionYears) || 1;
  const totalRetentionStorage = totalStorage * 365 * retention * replicationFactor;

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
    let unit = 'B';
    const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
    if (bytes < 1024) {
      return `${roundToNeat ? roundToNearestNeat(value) : value} B`;
    }
    value = value / 1024;
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Storage Planning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="artifactSize" className="block text-sm font-medium text-gray-700">
              Artifact Size
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="number"
                name="artifactSize"
                id="artifactSize"
                value={artifactSize}
                onChange={(e) => onArtifactSizeChange(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter size"
                min="0"
                required
              />
              <select
                name="artifactMagnitude"
                id="artifactMagnitude"
                value={artifactMagnitude}
                onChange={(e) => onArtifactMagnitudeChange(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-32 sm:text-sm border-gray-300 rounded-md"
              >
                <option value="B">Bytes</option>
                <option value="KB">KB</option>
                <option value="MB">MB</option>
                <option value="GB">GB</option>
                <option value="TB">TB</option>
                <option value="PB">PB</option>
              </select>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Specify the size of a single artifact (file/object) to be stored.
            </p>
          </div>
          <div>
            <label htmlFor="retentionYears" className="block text-sm font-medium text-gray-700">
              Retention Period (years)
            </label>
            <div className="flex items-center gap-4 mt-1">
              <input
                type="range"
                name="retentionYears"
                id="retentionYears"
                min="1"
                max="10"
                step="1"
                value={retentionYears}
                onChange={(e) => onRetentionYearsChange(e.target.value)}
                className="w-full"
              />
              <span className="text-sm font-semibold text-gray-700 w-8 text-center">{retentionYears}</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              How many years should the data be retained? (1-10 years)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Replication Factor</label>
            <div className="flex gap-2">
              {[1, 2, 3].map((factor) => (
                <button
                  key={factor}
                  type="button"
                  onClick={() => onReplicationFactorChange(factor)}
                  className={`
                    flex-1 py-2 px-4 border rounded-md text-sm font-medium
                    ${
                      replicationFactor === factor
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {factor}x
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              How many copies of the data will be stored (replication factor)?
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="roundToNeat"
              checked={roundToNeat}
              onChange={(e) => onRoundToNeatChange(e.target.checked)}
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
              <h4 className="text-sm font-medium text-gray-500">Daily storage needs</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{formatBytes(totalStorage)}</p>
              <p className="mt-2 text-sm text-gray-500">Total storage required for all write requests</p>
              <p className="mt-2 text-xs text-gray-400">Write count: {totalWrites.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Total Storage for Retention Period</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{formatBytes(totalRetentionStorage)}</p>
              <p className="mt-2 text-sm text-gray-500">Total storage required for all writes over {retentionYears} year(s) with {replicationFactor}x replication</p>
              <p className="mt-2 text-xs text-gray-400">Write count: {totalWrites.toLocaleString()} × {retentionYears} years × {replicationFactor}x</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageTab; 