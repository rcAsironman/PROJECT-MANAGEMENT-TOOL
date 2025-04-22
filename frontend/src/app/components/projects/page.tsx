'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Project = {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  people: {
    id: number;
    name: string;
    email: string;
    role: string;
  }[];
};

export default function ProjectScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  useEffect(() => {
    fetchProjects(page);
  }, [page]);

  const fetchProjects = async (page: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects?page=${page}&limit=20`);
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) => {
          const updated = [...prev, ...data.projects];
          if (updated.length >= data.total) setHasMore(false);
          return updated;
        });
      }
      else {
        toast.error(data.message || 'Failed to fetch projects');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };
  

  return (
    <div className="space-y-8">
      {/* Header + Create Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
        <button
          onClick={() => router.push('/createnewproject')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
        >
          Create New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          projects.length <1 && (
         <div className='flex flex-1 w-screen h-screen justify-center'>
           <h1 className='text-gray-400'>No projects yet, click on create new project to create a new project</h1>
         </div>
        )
        }
        {projects.map((project, index) => (
          <div
            key={project._id}
            onClick={() => router.push(`/project/${project._id}`)}
            className="flex rounded-xl shadow overflow-hidden bg-white cursor-pointer hover:shadow-lg transition"
          >
            <div className={`w-[10px] bg-indigo-500`} />
            <div className="p-6 space-y-2 w-full">
              <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
              <p className="text-sm text-gray-500"><strong>Start:</strong> {project.startDate}</p>
              <p className="text-sm text-gray-500"><strong>End:</strong> {project.endDate}</p>
              <p className="text-sm text-gray-600">{project.description}</p>
              <p className="text-sm text-gray-400">{project.people?.length || 0} {project.people?.length === 1 ? 'person' : 'people'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && projects.length >5 && (
        <div className="text-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="text-indigo-600 hover:underline text-sm"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
