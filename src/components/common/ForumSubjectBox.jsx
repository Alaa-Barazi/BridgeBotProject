import { useState } from "react";
import ForumSubjectContent from "./ForumSubjectContent";
import ActionButton from "./ActionButton";

const ForumSubjectBox = ({ title, body }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded shadow p-4 border dark:bg-gray-700 dark:text-white">
      {!open && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <ActionButton text="View" onClick={() => setOpen(true)} />
        </div>
      )}

      {open && (
        <ForumSubjectContent
          title={title}
          body={body}
          onBack={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default ForumSubjectBox;
