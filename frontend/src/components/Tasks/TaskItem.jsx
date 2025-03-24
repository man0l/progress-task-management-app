import { HiUserCircle, HiPencil, HiTrash } from "react-icons/hi2";
import { Link } from 'react-router-dom';

export default function TaskItem({ task, handleTaskComplete }) {
    return (
        <div className="p-4 bg-white rounded shadow-sm hover:shadow-md transition-shadow" id={`task-${task.id}`} key={task.id}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => handleTaskComplete(task.id, task.completed)}
                        className="w-5 h-5 rounded cursor-pointer" 
                        data-id={task.id}
                      />
                      <div className={`text-lg font-bold title ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {new Date(task.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <Link to={`/tasks/${task.id}/assign`} className="size-5 text-blue-500 hover:text-blue-700 transition-colors">
                        <HiUserCircle />
                      </Link>
                      <Link to={`/tasks/${task.id}/edit`} className="size-5 text-blue-500 hover:text-blue-700 transition-colors">
                        <HiPencil />
                      </Link>
                      <Link to={`/tasks/${task.id}/delete`} className="size-5 text-red-500 hover:text-red-700 transition-colors" data-trigger="delete-task" data-id={task.id}>
                        <HiTrash />
                      </Link>
                    </div>
                  </div>
                  <div className="text-sm font-normal text-gray-500 mt-2">{task.description}</div>
                  {task.completed ? (
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full status-badge">
                        Completed
                      </span>
                      {task.user && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Assigned to {task.user}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full status-badge">
                        Pending
                      </span>
                      {task.user && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          Assigned to {task.user}
                        </span>
                      )}
                    </div>
                 )}
        </div>
    );
}