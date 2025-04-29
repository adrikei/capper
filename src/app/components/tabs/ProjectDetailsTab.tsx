import React from 'react';

interface ProjectDetailsTabProps {
  projectName: string;
  projectDescription: string;
  onProjectNameChange: (name: string) => void;
  onProjectDescriptionChange: (description: string) => void;
}

export const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({
  projectName,
  projectDescription,
  onProjectNameChange,
  onProjectDescriptionChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          id="projectName"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter project name"
        />
      </div>
      <div>
        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
          Project Description
        </label>
        <textarea
          id="projectDescription"
          value={projectDescription}
          onChange={(e) => onProjectDescriptionChange(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter project description"
        />
      </div>
    </div>
  );
}; 