'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';

const dummyProject = {
  name: 'Website Redesign',
  description: 'Complete overhaul of the UI/UX for marketing site.',
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  createdBy: 'Jane Doe',
  people: Array.from({ length: 5 }).map((_, i) => `User ${i + 1}`),
};

const allPeople = Array.from({ length: 20 }).map((_, i) => `User ${i + 1}`);

type Task = {
  id: number;
  title: string;
  assignedTo: string;
  status: 'todo' | 'inprogress' | 'completed';
  deadline: string;  // Added deadline to task
  description: string;
};

const initialTasks: Task[] = [
  { id: 1, title: 'Wireframes', assignedTo: 'User 1', status: 'todo', deadline: '2024-02-01', description: "something here" },
  { id: 2, title: 'Design UI', assignedTo: 'User 2', status: 'inprogress', deadline: '2024-03-01', description: "something here" },
  { id: 3, title: 'Review UX', assignedTo: 'User 3', status: 'completed', deadline: '2024-04-01', description: "something here" },
];

export default function ProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState(dummyProject.people[0]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [projectPeople, setProjectPeople] = useState(dummyProject.people);
  const [searchPerson, setSearchPerson] = useState('');

  const handleCreateTask = () => {
    if (!newTask.trim() || !taskDeadline || !taskDescription) return;
    const newTaskObj: Task = {
      id: tasks.length + 1,
      title: newTask,
      assignedTo,
      status: 'todo',
      deadline: taskDeadline,
      description: "something here"
    };
    setTasks((prev) => [...prev, newTaskObj]);
    setNewTask('');
    setTaskDescription('');
    setTaskDeadline('');
  };

  const moveTask = (id: number, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const handleRemoveTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;
    setTasks((prev) =>
      prev.map((task) => (task.id === editingTask.id ? editingTask : task))
    );
    setEditingTask(null);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleAddPerson = (person: string) => {
    if (!projectPeople.includes(person)) {
      setProjectPeople([...projectPeople, person]);
    }
  };

  const handleRemovePerson = (person: string) => {
    setProjectPeople(projectPeople.filter((p) => p !== person));
  };

  const filteredPeople = allPeople.filter(
    (p) =>
      p.toLowerCase().includes(searchPerson.toLowerCase()) &&
      !projectPeople.includes(p)
  );

  const getTaskStatusClass = (deadline: string) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);

    const oneDayLeft = new Date(deadlineDate);
    oneDayLeft.setDate(oneDayLeft.getDate() - 1);

    if (currentDate > deadlineDate) return 'bg-red-200'; // Light red
    if (currentDate > oneDayLeft && currentDate < deadlineDate)
      return 'bg-yellow-200'; // Light yellow
    return ''; // Default background
  };

  const renderTasks = (status: Task['status']) =>
    tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div
          key={task.id}
          className={clsx(
            'bg-white rounded-md shadow px-6 py-4 space-y-4 flex flex-col justify-between border border-gray-200',
            getTaskStatusClass(task.deadline)
          )}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-black text-lg">{task.title}</p>
              <p className="text-sm text-gray-600">Assigned to: {task.assignedTo}</p>
              <p className="text-xs text-gray-500">Deadline: {task.deadline}</p>
              <p className="text-sm text-gray-600 mt-2">{task.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditTask(task)}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleRemoveTask(task.id)}
                className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Task status buttons */}
          <div className="flex justify-between mt-4">
            {task.status !== 'todo' && (
              <button
                onClick={() => moveTask(task.id, 'todo')}
                className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                To Do
              </button>
            )}
            {task.status !== 'inprogress' && (
              <button
                onClick={() => moveTask(task.id, 'inprogress')}
                className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                In Progress
              </button>
            )}
            {task.status !== 'completed' && (
              <button
                onClick={() => moveTask(task.id, 'completed')}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Completed
              </button>
            )}
          </div>
        </div>
      ));

  return (
    <div className="min-h-screen bg-white px-6 py-8 space-y-8">
      <button
        onClick={() => router.back()}
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Back to Projects
      </button>

      <h1 className="text-3xl font-bold text-black">{dummyProject.name}</h1>

      <div className="flex gap-6 border-b pb-2">
        {['tasks', 'people', 'info'].map((tab) => (
          <button
            key={tab}
            className={clsx(
              'capitalize px-2 pb-1 border-b-2 text-sm font-medium transition',
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-indigo-500'
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'tasks' ? 'Task Management' : tab}
          </button>
        ))}
      </div>

      {/* People Tab */}
      {activeTab === 'people' && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border space-y-6">
          <h2 className="text-xl font-semibold text-black">People in this project</h2>

          <div className="max-h-[300px] overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projectPeople.map((person, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-black">{person}</h3>
                    <p className="text-sm text-gray-600">Email: {person.toLowerCase().replace(' ', '')}@example.com</p>
                    <p className="text-sm text-gray-600">Role: {idx % 2 === 0 ? 'Developer' : 'Designer'}</p>
                  </div>
                  <button
                    onClick={() => handleRemovePerson(person)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-md font-medium text-black">Add New People</h3>
            <input
              type="text"
              value={searchPerson}
              onChange={(e) => setSearchPerson(e.target.value)}
              placeholder="Search people..."
              className="w-full px-4 py-2 border rounded-md text-black"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[200px] overflow-y-auto">
              {filteredPeople.map((person, idx) => (
                <div key={idx} className="bg-white p-3 rounded shadow border flex justify-between items-center">
                  <span className="text-black font-medium">{person}</span>
                  <button
                    onClick={() => handleAddPerson(person)}
                    className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              ))}
              {filteredPeople.length === 0 && (
                <p className="text-sm text-gray-500">No users found or all are added.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Tab */}
      {activeTab === 'info' && (
        <div className="bg-gray-50 p-5 rounded-lg border space-y-3 text-gray-700">
          <p><strong>Description:</strong> {dummyProject.description}</p>
          <p><strong>Start Date:</strong> {dummyProject.startDate}</p>
          <p><strong>End Date:</strong> {dummyProject.endDate}</p>
          <p><strong>Created By:</strong> {dummyProject.createdBy}</p>
        </div>
      )}

      {/* Task Management Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              placeholder="New Task Title"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded w-full text-black"
            />
            <input
              type="date"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded w-full text-black"
            />
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Task Description"
              className="border border-gray-300 px-3 py-2 rounded w-full text-black"
            />
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded text-black"
            >
              {dummyProject.people.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <button
              onClick={handleCreateTask}
              className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
            >
              Create Task
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {['todo', 'inprogress', 'completed'].map((status) => (
              <div key={status} className="bg-gray-50 rounded-lg shadow p-4 max-h-[500px] overflow-y-auto border space-y-3">
                <h3 className="font-semibold text-gray-700 mb-2">
                  {status === 'todo' && 'To Do'}
                  {status === 'inprogress' && 'In Progress'}
                  {status === 'completed' && 'Completed'}
                </h3>
                {renderTasks(status as Task['status'])}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
