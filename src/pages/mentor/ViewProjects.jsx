/**
 * ViewProjects
 * ------------
 * Mentor page for browsing and filtering student projects.
 *
 * Responsibilities:
 * - Search and filter projects
 * - Display project status and progress
 *
 * Dark mode design:
 * - Clear content surfaces
 * - No floating light elements
 * - Calm, professional tone
 */

import { CiFilter } from "react-icons/ci";
import ProjectMentorCard from "../../components/mentor/ProjectMentorCard";

const sampleProjects = [
  {
    id: "1",
    name: "Smart Greenhouse",
    description: "IoT based environmental monitoring system",
    leader: "Alaa",
    category: "IoT",
    progress: 70,
    status: "On track",
  },
  {
    id: "2",
    name: "Smart Parking System",
    description: "Camera based parking automation",
    leader: "Rozen",
    category: "Computer Vision",
    progress: 40,
    status: "Minor issues",
  },
];

const ViewProjects = () => {
  return (
    <div
      className="p-6 max-w-6xl mx-auto
                    bg-transparent dark:bg-[#0f172a]"
    >
      <h1
        className="text-3xl font-semibold mb-6
                     text-gray-900 dark:text-slate-200"
      >
        View Student Projects
      </h1>

      {/* Search and filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div
          className="flex items-center px-3 py-2 rounded
                     bg-white dark:bg-[#111827]
                     border border-gray-200 dark:border-[#1f2933]"
        >
          🔍
          <input
            type="text"
            placeholder="Search projects..."
            className="ml-2 bg-transparent outline-none
                       text-gray-800 dark:text-slate-300
                       placeholder-gray-400 dark:placeholder-slate-400"
          />
        </div>

        <div
          className="flex items-center px-3 py-2 rounded
                     bg-white dark:bg-[#111827]
                     border border-gray-200 dark:border-[#1f2933]"
        >
          <CiFilter />
          <select
            className="ml-2 bg-transparent outline-none
                       text-gray-800 dark:text-slate-300"
          >
            <option>Filter by status</option>
            <option>On track</option>
            <option>Minor issues</option>
            <option>Delayed</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {sampleProjects.map((project) => (
          <ProjectMentorCard
            key={project.id}
            projectId={project.id}
            project={project}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewProjects;
