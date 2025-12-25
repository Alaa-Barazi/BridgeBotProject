import { mockProjectExample, mockProjectNone } from "../../mock/mockProject";
import ProjectSetup from "./TeamProjectSetup";
import TeamProjectWorkspace from "./TeamProjectWorkspace";
import Architecture from "./TeamProjectArchitecture";

// Toggle this to test both states:
const USE_PROJECT = true;

export default function TeamProjectHome({ projectId }) {
  const project = USE_PROJECT ? mockProjectExample : mockProjectNone;

  if (!project) return <Architecture />;
  return <TeamProjectWorkspace />;
}
