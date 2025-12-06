import React from "react";

/* Project Name
Team Members
Quick status indicator
Last updated date */

const HeaderSection = ({ projectName, description, progress, status }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">{projectName}</h2>

      <p>Description: {description}</p>

      <div className="mt-2">
        <progress value={progress} max="100" />
      </div>

      <div className="mt-2">Status: {status}</div>
    </div>
  );
};

export default HeaderSection;
