'use client';

import { useState } from 'react';
import TrafficTab from './tabs/TrafficTab';
import StorageTab from './tabs/StorageTab';
import BandwidthTab from './tabs/BandwidthTab';
import MemoryTab from './tabs/MemoryTab';

type Tab = 'traffic' | 'storage' | 'bandwidth' | 'memory';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState<Tab>('traffic');

  const tabs = [
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
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-6">
        {activeTab === 'traffic' && <TrafficTab />}
        {activeTab === 'storage' && <StorageTab />}
        {activeTab === 'bandwidth' && <BandwidthTab />}
        {activeTab === 'memory' && <MemoryTab />}
      </div>
    </div>
  );
}