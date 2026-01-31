/**
 * EmptyProjectState
 *
 * Placeholder view shown when a project has no workspace yet.
 * Encourages the user to start by creating the project architecture.
 */

import ActionButton from "../../common/ActionButton";

export default function EmptyProjectState({ onCreateArchitecture, title,subtitle }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        {title? title : "No Architecture Defined Yet"}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {subtitle? subtitle : "It looks like your project doesn't have any architecture defined yet. Start by creating the project architecture to get things rolling!"}
      </p>

      {/* <div className="flex gap-3">
        <ActionButton
          text="Create Architecture"
          onClick={onCreateArchitecture}
        />
      </div> */}
    </div>
  );
}
