import React from "react";
import { CiFilter } from "react-icons/ci";
import ProjectMentorCard from "../../components/mentor/ProjectMentorCard";
import { Link } from "react-router-dom";
const sampleProjects = [
  {
    id: 1,
    projectName: "Smart Home IoT",
    teamLeader: "Alaa",
    description: "Home automation using NodeMCU and sensors",
    progress: 70,
    status: "On track",
  },
  {
    id: 2,
    projectName: "Waste Management System",
    teamLeader: "Sara",
    description: "IoT smart bin project",
    progress: 40,
    status: "Minor issues",
  },
];

const ViewProjects = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">View Student Projects</h1>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center border rounded px-3 py-2 bg-white">
          🔍
          <input
            type="text"
            placeholder="Search projects..."
            className="ml-2 outline-none"
          />
        </div>

        <div className="flex items-center border rounded px-3 py-2 bg-white">
          <CiFilter />
          <select className="ml-2">
            <option>Filter by status</option>
            <option>On track</option>
            <option>Minor issues</option>
            <option>Delayed</option>
          </select>
        </div>
      </div>
      <Link
        to="/mentor/project-overview"
        className="text-blue-600 hover:underline"
      >
        Open Project Overview
      </Link>
      {/* Project Cards */}
      {sampleProjects.map((project) => (
         <ProjectMentorCard key={project.id} projectId={project.id} project={project} />
      ))}
    </div>
  );
};

export default ViewProjects;
