export default function ProjectHeader({ projectName, description }) {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        {projectName}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        {description}
      </p>
    </div>
  );
}
