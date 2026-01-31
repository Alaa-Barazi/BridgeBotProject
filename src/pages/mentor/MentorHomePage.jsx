/*
 *MentorHomePage
 *Home page for the mentor where he see as first page the place for
 *uploading the documents and quiz+dictionary for each week */
import WeekMaterialsManager from "../../components/mentor/WeekMaterialsManager";

export default function MentorHomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mentor Home
        </h1>

        <WeekMaterialsManager />
      </div>
    </div>
  );
}
