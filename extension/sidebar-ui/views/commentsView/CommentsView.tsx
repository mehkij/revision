type Comment = {
  id: string;
  author: string;
  avatar_url: string;
  body: string;
  date: string;
  filepath: string;
};

const MOCK_COMMENTS: Comment[] = [
  {
    id: "123456789",
    author: "mehkij",
    avatar_url: "https://avatars.githubusercontent.com/u/109314751?v=4",
    body: "Fix fix fix",
    date: "07-26-2025",
    filepath: "src/main.tsx",
  },
  {
    id: "987654321",
    author: "OmarEP",
    avatar_url: "https://avatars.githubusercontent.com/u/32280939?v=4",
    body: "Something something something",
    date: "07-26-2025",
    filepath: "src/App.tsx",
  },
];

function CommentsView() {
  return (
    <div className="flex-col">
      {MOCK_COMMENTS.map((comment) => (
        // Comment card
        <div
          className="bg-gray-700 shadow-md rounded-lg border border-gray-600 p-6 mb-4 w-full max-w-md"
          key={comment.id}
        >
          <div className="flex items-center mb-6 justify-between">
            <div className="flex items-center">
              <img
                src={comment.avatar_url}
                className="w-12 h-12 rounded-full mr-4"
              />
              <span className="font-semibold text-white">{comment.author}</span>
            </div>
            <span className="text-xs text-gray-400">{comment.date}</span>
          </div>

          <div className="mb-4">
            <p className="text-white">{comment.body}</p>
          </div>

          <footer className="text-cs text-gray-400">{comment.filepath}</footer>
        </div>
      ))}
    </div>
  );
}

export default CommentsView;
