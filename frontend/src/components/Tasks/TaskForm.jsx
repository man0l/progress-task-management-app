import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

export default function TaskForm({ task, onSubmit }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        defaultValues: {
            title: task?.title || '',
            description: task?.description || '',
            completed: task?.completed || false
        }
    });

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                completed: task.completed
            });
        }
    }, [task, reset]);

    const onSubmitHandler = async (data) => {
        try {
            const taskData = {
                ...(task?.id && { id: task.id }),
                ...data
            };
            await onSubmit(taskData);
            if (!task) {
                reset(); // Only reset if it's a new task form
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <>
            <div className="text-xl font-bold mb-4">
                {task ? 'Edit Task' : 'Add Task'}
            </div>
            
            <div className="w-1/5">
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="flex flex-col gap-2 mt-2">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            className="border rounded p-2"
                            {...register("title", {
                                required: "Title is required",
                                minLength: {
                                    value: 3,
                                    message: "Title must be at least 3 characters"
                                },
                                maxLength: {
                                    value: 50,
                                    message: "Title must be less than 50 characters"
                                }
                            })}
                        />
                        {errors.title && (
                            <div className="text-red-500">
                                {errors.title.message}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            id="description"
                            className="border rounded p-2"
                            {...register("description", {
                                required: "Description is required",
                                maxLength: {
                                    value: 200,
                                    message: "Description must be less than 200 characters"
                                }
                            })}
                        />
                        {errors.description && (
                            <div className="text-red-500">
                                {errors.description.message}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 items-start mt-2">
                        <label htmlFor="completed">Completed</label>
                        <input
                            type="checkbox"
                            id="completed"
                            className="border rounded p-2"
                            {...register("completed")}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-blue-500 text-white py-1 px-3 mt-2 rounded
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    >
                        {isSubmitting ? 'Saving...' : (task ? 'Update' : 'Save')}
                    </button>
                </form>
            </div>
        </>
    );
}