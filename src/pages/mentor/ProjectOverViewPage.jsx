import HeaderSection from "../../components/overview/HeaderSection";
import SummaryBox from "../../components/overview/SummaryBox";
import DocumentsSection from "../../components/overview/DocumentsSection";
import { useParams } from "react-router-dom";
const ProjectOverViewPage = () => {
  const { projectId } = useParams();
  return (
    <div className="p-6">
      <h1>Project Overview for Project {projectId}</h1>
      {/* Project Name
      Team Members
      Quick status indicator
      Last updated date */}
      <div className="mb-6">
        Header Section
        <HeaderSection />
      </div>

      <div className="mb-6">
        Summary
        <SummaryBox />
      </div>

      <div className="mb-6">Text area</div>

      {/* the mentor should only see their project and documents */}
      <div className="mt-10">
        <DocumentsSection />
      </div>
    </div>
  );
};

export default ProjectOverViewPage;
