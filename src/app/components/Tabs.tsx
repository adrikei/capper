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

  const tabs: { id: Tab; label: string }[] = [
    { id: 'project', label: 'Project Details' },
    { id: 'traffic', label: 'Traffic' },
    { id: 'storage', label: 'Storage' },
    { id: 'bandwidth', label: 'Bandwidth' },
    { id: 'memory', label: 'Memory' },
  ];

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
        {activeTab === 'storage' && <StorageTab />}
        {activeTab === 'bandwidth' && <BandwidthTab />}
        {activeTab === 'memory' && <MemoryTab />}
      </div>
    </div>
  );
};