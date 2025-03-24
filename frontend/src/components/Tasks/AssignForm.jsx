import { useForm } from 'react-hook-form';

export default function AssignForm({ task, onSubmit, users }) {
  const { register, handleSubmit } = useForm();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Assign Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4"   >
        <select {...register("user_id")} className="border rounded p-2">
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.email}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors">Assign</button>
      </form>
    </div>
  );
};