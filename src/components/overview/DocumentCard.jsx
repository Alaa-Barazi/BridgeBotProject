import React from "react";
import { LuFileText } from "react-icons/lu";

const DocumentCard = ({ title, lastUpdated, onOpen }) => {
  return (
    <div
      onClick={onOpen}
      className="cursor-pointer bg-white dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-700 
                 rounded-lg p-5 shadow-sm hover:shadow-md transition 
                 flex flex-col"
    >
      <div className="flex items-center gap-3">
        <LuFileText className="text-2xl text-gray-700 dark:text-gray-200" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
        Last updated: {lastUpdated}
      </p>
    </div>
  );
};

export default DocumentCard;
