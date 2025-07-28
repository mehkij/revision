import { useState, useEffect } from "react";
import CreateCommentButton from "./components/CreateCommentButton";

function CommentCreationView() {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [vscode, setVscode] = useState<any | null>(null);

  useEffect(() => {
    const vscodeApi = window.acquireVsCodeApi?.();
    if (vscodeApi) {
      setVscode(vscodeApi);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === "commentAdded") {
        setComment("");
        setLoading(false);
        setError(null);
      }
      if (message.command === "error") {
        setError(message.message);
        setLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleCommentSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      vscode.postMessage({
        command: "addComment",
        data: {
          text: comment,
          author: "mehkij",
          filePath: "src/whatever.tsx",
          repo: "revision",
          commitHash: "asdfddscv11232134sdadas",
          avatar_url: "https://avatars.githubusercontent.com/u/109314751?v=4",
        },
      });

      // Clear the input after successful submission (optional)
      setComment("");
    } catch (err) {
      console.error("Error submitting comment:", err);
      const errorMessage = "Failed to submit comment. Please try again later.";
      setError(errorMessage);

      // Send error to extension
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (vscode) {
        vscode.postMessage({
          command: "error",
          message: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col justify-center items-center h-full w-full gap-12">
      <h1 className="text-2xl font-bold mb-4">Create a Comment</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <textarea
        className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
        placeholder="Write your comment here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <CreateCommentButton
        onClick={handleCommentSubmit}
        loading={loading}
        vscode={vscode}
      />
    </div>
  );
}

export default CommentCreationView;
