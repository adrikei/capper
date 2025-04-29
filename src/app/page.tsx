import Image from "next/image";
import Tabs from './components/Tabs';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Capacity Planner</h1>
          <Tabs />
        </div>
      </div>
    </div>
  );
}
