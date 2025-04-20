'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Project = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
};

// Tailwind color classes
const colorVariants = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-rose-500',
  'bg-indigo-500',
];

// Generate 100 mock projects
const allProjects: Project[] = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  name: `Project ${i + 1}`,
  description: `This is a description for project ${i + 1}. It focuses on UI/UX improvements and backend integration.`,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  peopleCount: (i % 5) + 1,
}));

export default function ProjectScreen() {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(20);
  const visibleProjects = allProjects.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  // Random color selector (consistent but random-looking)
  const getRandomColorClass = (index: number) => {
    return colorVariants[index % colorVariants.length];
  };

  return (
    <div className="space-y-8">
      {/* Header + Create */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
        <button
          onClick={() => router.push('/createnewproject')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
        >
          Create New Project
        </button>
      </div>

      {/* Scrollable grid of project cards */}
      <div className="max-h-[500px] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.map((project, index) => (
            <div
              key={project.id}
              className="flex rounded-xl shadow overflow-hidden bg-white cursor-pointer hover:shadow-lg transition"
              onClick={() => router.push(`/project/${project.id}`)}
            >
              <div className={`w-[10px] ${getRandomColorClass(index)}`} />
              <div className="p-6 space-y-2 w-full">
                <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                <p className="text-sm text-gray-500">
                  <strong>Start:</strong> {project.startDate}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>End:</strong> {project.endDate}
                </p>
                <p className="text-sm text-gray-600">{project.description}</p>
                <p className="text-sm text-gray-400">
                {project.peopleCount} {project.peopleCount === 1 ? 'person' : 'people'}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Load More */}
      {visibleProjects.length < allProjects.length && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="text-indigo-600 hover:underline text-sm"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
