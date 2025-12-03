import ActionButton from "./ActionButton";

const ReplyBox = () => {
  return (
    <div
      className="mt-6 bg-gray-50 dark:bg-gray-900 
                    p-5 rounded-lg border border-gray-300 dark:border-gray-700"
    >
      <textarea
        className="w-full border border-gray-300 dark:border-gray-600 
                   rounded-md px-3 py-2 mb-4
                   focus:ring-1 focus:ring-blue-500
                   dark:bg-gray-800 dark:text-white"
        rows="3"
        placeholder="Type your reply..."
      />

      <div className="flex gap-3">
        {/* <ActionButton
          buttonStyle="px-3 py-2 rounded-md  text-gray-700 dark:text-gray-200 hover:bg-sky-200 hover:text-white dark:hover:bg-gray-800"
          onClick={() => {}}
          text="Save"
        />
         <ActionButton
          text="Login"
          backgroundColor="CornflowerBlue"
          onClick={() => {}}
        /> */}
        <ActionButton text="Save" onClick={() => {}} />
        <ActionButton text="Clear" type="clear" onClick={() => {}} />
      </div>
    </div>
  );
};

export default ReplyBox;
