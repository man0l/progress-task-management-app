export default function Filters({ filters, handleFilterChange, handleResetFilters, handleFilterSubmit, users }) {
  return (
    <div className="mb-6">
          <h1 className="text-lg font-semibold mb-3">Filters</h1>
          <form onSubmit={handleFilterSubmit} className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-col">
                <label htmlFor="status" className="text-sm text-gray-600 mb-1">Status</label>
                <select 
                  className="border rounded p-2 w-48 bg-white" 
                  name="status" 
                  id="status" 
                  value={filters.status} 
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="true">Completed</option>
                  <option value="false">Pending</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="user" className="text-sm text-gray-600 mb-1">Assigned User</label>
                <select 
                  className="border rounded p-2 w-48 bg-white" 
                  name="user" 
                  id="user" 
                  value={filters.user} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.email}</option>
                  ))}
                </select>
              </div>
              <div className="self-end">
                <button 
                  type="button" 
                  onClick={handleResetFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded transition-colors"
                >
                  Reset Filters
                </button>
              </div>
          </form>
    </div>
  );
}