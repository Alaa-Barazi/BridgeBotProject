

const ProjectMentorView = ({
  projectName,
  teamLeader,
  description,
  progress,
  status,
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">{projectName}</h2>

      <p>Team leader: {teamLeader}</p>
      <p>Description: {description}</p>

      <div className="mt-2">
        <progress value={progress} max="100" />
        <span>{progress}%</span>
      </div>

      <div className="mt-2">Status: {status}</div>
    </div>
  );
};

export default ProjectMentorView;
