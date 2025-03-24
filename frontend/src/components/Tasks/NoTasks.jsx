import { Link } from 'react-router-dom';

export default function NoTasks({ handleResetFilters }) {
  return (
    <div className="p-6 bg-gray-50 rounded text-center">
        <p className="text-gray-600 mb-3">No tasks found.</p>
        <div className="flex gap-3 justify-center">
        <button
            onClick={handleResetFilters}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded transition-colors"
        >
            Clear Filters
        </button>
        <Link to="/tasks/add" className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded transition-colors">
            Add New Task
        </Link>
        </div>
    </div>
  );
}