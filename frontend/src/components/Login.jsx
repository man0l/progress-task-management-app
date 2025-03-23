import Layout from './Layout';

const Login = () => {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-xl font-bold text-blue-500 p-4">Login</h1>
        <div className="w-full max-w-lg bg-gray-100 p-4 rounded-md">
            <form className="bg-white shadow-md p-4 rounded-md w-full">
                <div className="mb-4 mt-4">
                    <label htmlFor="email" className="mr-2 mb-2 block">Email</label>    
                    <input type="text" placeholder="Email" className="w-full py-2 px-3 shadow appearance-none leading-tight" />
                </div>
                <div className="mb-4 mt-4">
                    <label htmlFor="password" className="mr-2 mb-2 block">Password</label>
                    <input type="password" placeholder="Password" className="w-full py-2 px-3 shadow appearance-none leading-tight" />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Login</button>
            </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;