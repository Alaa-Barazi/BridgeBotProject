import { mockProjectExample, mockProjectNone } from "../../mock/mockProject";
import ProjectSetup from "./TeamProjectSetup";
import ProjectWorkspace from "./TeamProjectWorkspace";

// Toggle this to test both states:
const USE_PROJECT = true;

export default function TeamProjectHome() {
  const project = USE_PROJECT ? mockProjectExample : mockProjectNone;

  if (!project) return <ProjectSetup />;

  return <ProjectWorkspace project={project} />;
}
