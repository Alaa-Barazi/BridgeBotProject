import QuestionsCard from "../components/common/QuestionsCard";
import InputField from "../components/common/InputField";

const Quiz = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Quiz - let's test you
      </h1>

      <div className="space-y-8">
        <QuestionsCard question={"What is IoT?"} questionNo={1} />

        <InputField
          type="text"
          label="Type your answer"
          placeholder="Write your answer here"
        />
      </div>
    </div>
  );
};

export default Quiz;
