'use client';

import React, { useState } from 'react';
import TrafficTab from './tabs/TrafficTab';
import StorageTab from './tabs/StorageTab';
import BandwidthTab from './tabs/BandwidthTab';
import MemoryTab from './tabs/MemoryTab';
import { ProjectDetailsTab } from './tabs/ProjectDetailsTab';

type Tab = 'project' | 'traffic' | 'storage' | 'bandwidth' | 'memory';
type Magnitude = '1' | '1K' | '1M' | '1B';
type ReadWriteRatio = '10:1' | '50:1' | '100:1';

export const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('project');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  
  // Traffic-related state
  const [dailyUsersNumber, setDailyUsersNumber] = useState('');
  const [dailyUsersMagnitude, setDailyUsersMagnitude] = useState<Magnitude>('1');
  const [readWriteRatio, setReadWriteRatio] = useState<ReadWriteRatio>('10:1');

  // Storage-related state
  const [artifactSize, setArtifactSize] = useState('');
  const [artifactMagnitude, setArtifactMagnitude] = useState('B');
  const [retentionYears, setRetentionYears] = useState('5');
  const [storageRoundToNeat, setStorageRoundToNeat] = useState(false);
  const [replicationFactor, setReplicationFactor] = useState(1);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'project', label: 'Project Details' },
    { id: 'traffic', label: 'Traffic' },
    { id: 'storage', label: 'Storage' },
    { id: 'bandwidth', label: 'Bandwidth' },
    { id: 'memory', label: 'Memory' },
  ];

  // Calculate write requests for storage tab
  const getWriteRequests = () => {
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
    const totalWrites = Math.round(users * writeMultiplier);
    const secondsInDay = 24 * 60 * 60;
    const writesPerSecond = Math.round(totalWrites / secondsInDay);
    const peakTimeSeconds = Math.round(secondsInDay * 0.2);
    const peakWritesPerSecond = Math.round((totalWrites * 0.8) / peakTimeSeconds);
    return {
      totalWrites,
      writesPerSecond,
      peakWritesPerSecond,
    };
  };
  const writeRequests = getWriteRequests();

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'project' && (
          <ProjectDetailsTab
            projectName={projectName}
            projectDescription={projectDescription}
            onProjectNameChange={setProjectName}
            onProjectDescriptionChange={setProjectDescription}
          />
        )}
        {activeTab === 'traffic' && (
          <TrafficTab
            dailyUsersNumber={dailyUsersNumber}
            dailyUsersMagnitude={dailyUsersMagnitude}
            readWriteRatio={readWriteRatio}
            onDailyUsersNumberChange={setDailyUsersNumber}
            onDailyUsersMagnitudeChange={setDailyUsersMagnitude}
            onReadWriteRatioChange={setReadWriteRatio}
          />
        )}
        {activeTab === 'storage' && (
          <StorageTab
            totalWrites={writeRequests.totalWrites}
            writesPerSecond={writeRequests.writesPerSecond}
            peakWritesPerSecond={writeRequests.peakWritesPerSecond}
            artifactSize={artifactSize}
            artifactMagnitude={artifactMagnitude}
            retentionYears={retentionYears}
            roundToNeat={storageRoundToNeat}
            replicationFactor={replicationFactor}
            onArtifactSizeChange={setArtifactSize}
            onArtifactMagnitudeChange={setArtifactMagnitude}
            onRetentionYearsChange={setRetentionYears}
            onRoundToNeatChange={setStorageRoundToNeat}
            onReplicationFactorChange={setReplicationFactor}
          />
        )}
        {activeTab === 'bandwidth' && <BandwidthTab />}
        {activeTab === 'memory' && <MemoryTab />}
      </div>
    </div>
  );
};