import Layout from './Layout';

export default function Preloader({ text }) {
  return (
    <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse text-gray-600">{text}</div>
        </div>
      </Layout>
  );
}