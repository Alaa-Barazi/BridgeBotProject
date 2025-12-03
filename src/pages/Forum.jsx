import ForumSubjectBox from "../components/common/ForumSubjectBox";

const Forum = () => {
  const subjects = [
    {
      id: 1,
      title: "How to connect sensors?",
      body: "I need help understanding...",
    },
    {
      id: 2,
      title: "Best way to use MQTT?",
      body: "What is the cleanest setup?",
    },
  ];

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">
        Forum
      </h1>

      <div className="space-y-4">
        {subjects.map((subject) => (
          <ForumSubjectBox
            key={subject.id}
            title={subject.title}
            body={subject.body}
          />
        ))}
      </div>
    </div>
  );
};

export default Forum;
