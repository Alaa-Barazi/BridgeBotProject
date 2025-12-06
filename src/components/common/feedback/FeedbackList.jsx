import FeedbackItem from "./FeedbackItem";

const FeedbackList = ({ feedback }) => {
  if (feedback.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400 text-center">
        No feedback submitted yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <FeedbackItem
          key={item.id}
          user={item.user}
          message={item.message}
          timestamp={item.timestamp}
        />
      ))}
    </div>
  );
};

export default FeedbackList;
