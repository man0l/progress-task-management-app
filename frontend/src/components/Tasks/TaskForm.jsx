export default function TaskForm({ task, form, handleSubmit }) {
    return (
        <>
        <div>Add Task</div>        
             
        <div className="w-1/5">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 mt-2">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" value={form?.title?.value} className="border rounded p-2" />
                    <div className="text-red-500">
                        {form?.title?.errors}
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" name="description" value={form?.description?.value} className="border rounded p-2" />
                    <div className="text-red-500">
                        {form?.description?.errors}
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-start mt-2">
                    <label htmlFor="completed">Completed</label>
                    <input type="checkbox" id="completed" name="completed" checked={form?.completed?.value} className="border rounded p-2" />
                    <div className="text-red-500">
                        {form?.completed?.errors}
                    </div>
                </div>
                <button type="submit" className="bg-blue-500 text-white py-1 px-3 mt-2 rounded">
                    {task ? 'Update' : 'Save'}
                </button>
            </form>
        </div>
        </>
    );
}