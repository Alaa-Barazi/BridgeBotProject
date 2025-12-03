import { useState } from "react";
import QuestionsCard from "../components/common/QuestionsCard";
import InputField from "../components/common/InputField";
import PrimaryButton from "../components/common/PrimaryButton";

const Quiz = () => {
  const questions = [
    { question: "What is IoT?" },
    { question: "Name one IoT communication protocol" },
    { question: "What is a microcontroller?" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Quiz - let's test you</h1>

      <div className="space-y-8">
        <QuestionsCard
          questionNo={currentIndex + 1}
          question={questions[currentIndex].question}
        />

        <InputField
          type="text"
          label="Type your answer"
          placeholder="Write your answer here"
        />

        <PrimaryButton label="Next question" onClick={handleNext} />
      </div>
    </div>
  );
};

export default Quiz;
