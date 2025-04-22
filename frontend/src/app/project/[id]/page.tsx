'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// Types

type Person = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type User = {
  name: string;
  email: string;
};

type Task = {
  _id: string;
  title: string;
  description: string;
  assignedTo: string;
  deadline: string;
  status: 'todo' | 'inprogress' | 'completed';
};

type Project = {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  people: Person[];
  createdBy: User;
};

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchPerson, setSearchPerson] = useState('');
  const [projectPeople, setProjectPeople] = useState<Person[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersNotInProject, setUsersNotInProject] = useState<User[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  const userRole = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || '{}')?.role || ''
    : '';

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}`);
        let data = await res.json();

        if (!res.ok) {
          toast.error(data.message || 'Failed to load project');
          return;
        }

        setProject(data.project);
        setProjectPeople(data.project.people);
        setAssignedTo(data.project.people.length > 0 ? data.project.people[0].email : '');
        const userRes = await fetch('http://localhost:5000/api/users?page=1&limit=20');
        const allUsersData = await userRes.json();

        if (!userRes.ok) {
          toast.error(allUsersData.message || 'Failed to load users');
          return;
        }

        setAllUsers(allUsersData.users);

        // Call only once after project and tasks are loaded
        await fetch(`http://localhost:5000/api/send-task-reminders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: id })
        });

        // Filter users not in the project
        const notInProject = allUsersData.users.filter((user: User) => {
          return !data.project.people.some((p: Person) => p.email === user.email);
        });

        setUsersNotInProject(notInProject);


      } catch (err) {
        toast.error('Server error');
      }
    };


    const loadMoreUsers = async () => {
      const nextPage = userPage + 1;
      const res = await fetch(`http://localhost:5000/api/users?page=${nextPage}&limit=20`);
      const data = await res.json();

      if (res.ok) {
        setAllUsers((prev) => [...prev, ...data.users]);
        setUserPage(nextPage);
        if (data.users.length < 20) setHasMoreUsers(false);

        // Update users not in project list
        const newUsers = data.users.filter((user: User) =>
          !project?.people.some((p: Person) => p.email === user.email)
        );
        setUsersNotInProject((prev) => [...prev, ...newUsers]);
      } else {
        toast.error(data.message || 'Failed to fetch more users');
      }
    };


    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}/tasks`);
        const data = await res.json();
        if (res.ok) {
          setTasks(data.tasks);
        } else {
          toast.error(data.message || 'Failed to load tasks');
        }
      } catch (err) {
        toast.error('Server error');
      }
    };

    fetchProject();
    fetchTasks();
  }, [id]);

  const sendEmailNotification = async (task: any, projectId: string) => {
    const emailData = {
      subject: `Task Deadline Notification: ${task.title}`,
      body: `Hi ${task.assignedTo},\n\nThis is a reminder that the task "${task.title}" is due on ${task.deadline}. Please ensure the task is completed on time.\n\nDescription: ${task.description}`,
      recipient: task.assignedTo,
      projectId: projectId, // Pass the projectId to the backend
    };

    try {
      // Send email to backend which will handle sending the email with delay
      const res = await fetch('http://localhost:5000/api/send-task-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Email sent to the user');
      } else {
        toast.error(data.message || 'Failed to send email');
      }
    } catch (err) {
      toast.error('Error sending email');
    }
  };





  const handleCreateTask = async () => {
    if (!newTask.trim() || !taskDeadline || !taskDescription || !assignedTo) {
      toast.error("Must provide all details and assign the task.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask,
          description: taskDescription,
          deadline: taskDeadline,
          assignedTo: assignedTo 
        })
      });

      const data = await res.json();
      if (res.ok) {
        setTasks((prev) => [...prev, data.task]);
        toast.success('Task created');
        setNewTask('');
        setTaskDescription('');
        setTaskDeadline('');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleEditTask = (task: Task) => setEditingTask(task);

  const handleSaveEdit = async () => {
    if (!editingTask) return;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask)
      });
      const data = await res.json();
      if (res.ok) {
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? editingTask : t)));
        toast.success('Task updated');
        setEditingTask(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleCancelEdit = () => setEditingTask(null);

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    const taskToUpdate = tasks.find((t) => t._id === taskId);
    if (!taskToUpdate) return;
    try {
      const updated = { ...taskToUpdate, status: newStatus };
      const res = await fetch(`http://localhost:5000/api/projects/${id}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (res.ok) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const loadMoreUsers = async () => {
    const nextPage = userPage + 1;
    const res = await fetch(`http://localhost:5000/api/users?page=${nextPage}&limit=20`);
    const data = await res.json();

    if (res.ok) {
      setAllUsers((prev) => [...prev, ...data.users]);
      setUserPage(nextPage);
      if (data.users.length < 20) setHasMoreUsers(false);

      // Update users not in project list
      const newUsers = data.users.filter((user: User) =>
        !project?.people.some((p: Person) => p.email === user.email)
      );
      setUsersNotInProject((prev) => [...prev, ...newUsers]);
    } else {
      toast.error(data.message || 'Failed to fetch more users');
    }
  };


  const handleRemovePerson = async (personId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}/people/${personId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        const removedPerson = projectPeople.find((person) => person.id.toString() === personId);

        // If person was found, update the states
        if (removedPerson) {
          setUsersNotInProject((prev) => [...prev, removedPerson]);
          setProjectPeople((prev) => prev.filter((p) => p.id.toString() !== personId));

          toast.success('User removed from project');
        }
      } else {
        toast.error(data.message || 'Failed to remove user');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleAddPersonToProject = async (user: User) => {
    try {
      const newPerson = {
        id: Date.now(),
        name: user.name,
        email: user.email,
        role: 'Member',
      };

      const res = await fetch(`http://localhost:5000/api/projects/${id}/people`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person: newPerson }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('User added to project');

        // Add new user to the projectPeople list
        setProjectPeople((prev) => [...prev, newPerson]);

        // Remove user from available list
        setUsersNotInProject((prev) =>
          prev.filter((u) => u.email !== user.email)
        );
      } else {
        toast.error(data.message || 'Failed to add user');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };


  const getTaskStatusClass = (deadline: string, status: Task['status']) => {
    if (status === 'completed') return 'bg-green-100';

    const today = new Date();
    const deadlineDate = new Date(deadline);
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffInTime = deadlineDate.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

    if (diffInDays < 2) return 'bg-red-100';       // Due today
    if (diffInDays <= 2 && diffInDays > 1) return 'bg-yellow-100';  
    return ''; // white background
  };


  const renderTasks = (status: Task['status']) => tasks
    .filter((task) => task.status === status)
    .map((task) => {
      const isEditing = editingTask?._id === task._id;
      return (
        <div key={task._id} className={clsx('rounded-md shadow px-6 py-4 ...', getTaskStatusClass(task.deadline, task.status))}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-1">
              {isEditing ? (
                <>
                  <input type="text" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} className="border p-2 rounded w-full text-black" />
                  <textarea value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} className="border p-2 rounded w-full text-black" />
                  <input type="date" value={editingTask.deadline} onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })} className="border p-2 rounded w-full text-black" />
                  <select value={editingTask.assignedTo} onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })} className="border p-2 rounded w-full text-black">
                    {project?.people.map((p) => (
                      <option key={p.id} value={p.email}>{p.email}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <p className="font-semibold text-black text-lg">{task.title}</p>
                  <p className="text-sm text-gray-600">Assigned to: {task.assignedTo}</p>
                  <p className="text-xs text-gray-500">Deadline: {task.deadline}</p>
                  <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {isEditing ? (
                <>
                  <button onClick={handleSaveEdit} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Save</button>
                  <button onClick={handleCancelEdit} className="text-xs bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500">Cancel</button>
                </>
              ) : (
                <button onClick={() => handleEditTask(task)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Edit</button>
              )}
            </div>
          </div>
          {!isEditing && (
            <div className="flex justify-between mt-4">
              {task.status !== 'todo' && <button onClick={() => handleStatusChange(task._id, 'todo')} className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">To Do</button>}
              {task.status !== 'inprogress' && <button onClick={() => handleStatusChange(task._id, 'inprogress')} className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">In Progress</button>}
              {task.status !== 'completed' && <button onClick={() => handleStatusChange(task._id, 'completed')} className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Completed</button>}
            </div>
          )}
        </div>
      );
    });

  if (!project) return <p className="text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-white px-6 py-8 space-y-8">
      <button
        onClick={() => router.push('/dashboard?tab=projects')}
        className="text-sm text-indigo-600 hover:underline"
      >
        Back to Projects
      </button>

      <h1 className="text-3xl font-bold text-black">{project.title}</h1>
      <div className="flex gap-6 border-b pb-2">
        {['tasks', 'people', 'info'].map((tab) => (
          <button key={tab} className={clsx('capitalize px-2 pb-1 border-b-2 text-sm font-medium transition', activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-indigo-500')} onClick={() => setActiveTab(tab)}>
            {tab === 'tasks' ? 'Task Management' : tab === 'people' ? 'Project People' : 'About Project'}
          </button>
        ))}
      </div>
      {activeTab === 'info' && (
        <div className="bg-gray-50 p-5 rounded-lg border space-y-3 text-gray-700">
          <p><strong>Description:</strong> {project.description}</p>
          <p><strong>Start Date:</strong> {project.startDate}</p>
          <p><strong>End Date:</strong> {project.endDate}</p>
          <p><strong>Created By:</strong> {project.createdBy?.email}</p>
        </div>
      )}

      {activeTab === 'people' && (
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-black mb-4">People in this project</h2>

            {projectPeople.length === 0 ? (
              <p className="text-sm text-gray-600">No users assigned to this project.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-1">
                {projectPeople.map((person, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-1"
                  >
                    <h3 className="font-medium text-black">{person.name}</h3>
                    <p className="text-sm text-gray-600">Email: {person.email}</p>
                    <p className="text-sm text-gray-600">Role: {person.role}</p>
                    {(userRole === 'Admin' || userRole === 'Root') && (
                      <button
                        onClick={() => handleRemovePerson(person.id.toString())}
                        className="text-xs text-red-600 hover:underline mt-2 self-start"
                      >
                        Remove
                      </button>)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-semibold text-black">Add Users to Project</h3>

            {usersNotInProject.length === 0 ? (
              <p className="text-sm text-gray-500">All users are already added to this project.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-1">
                  {usersNotInProject.map((user, idx) => (
                    <div key={idx} className="bg-white p-3 rounded shadow border flex justify-between items-center">
                      <div>
                        <p className="text-black font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <button
                        className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700"
                        onClick={() => handleAddPersonToProject(user)}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>

                {/* Optional load more button if using paginated user fetch */}
                {hasMoreUsers && (
                  <div className="text-center">
                    <button
                      onClick={loadMoreUsers}
                      className="mt-2 text-sm text-indigo-600 hover:underline"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input type="text" placeholder="New Task Title" value={newTask} onChange={(e) => setNewTask(e.target.value)} className="border border-gray-300 px-3 py-2 rounded w-full text-black" />
            <input type="date" value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} className="border border-gray-300 px-3 py-2 rounded w-full text-black" />
            <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Task Description" className="border border-gray-300 px-3 py-2 rounded w-full text-black" />
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="border border-gray-300 px-3 py-2 rounded text-black">
              {project.people.map((p) => (
                <option key={p.id} value={p.email}>{p.email}</option>
              ))}
            </select>

            <button onClick={handleCreateTask} className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700">Create Task</button>
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
        </>
      )}
    </div>
  );
}
