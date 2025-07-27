import axios from "axios";
import { useEffect, useState } from "react";

type Comment = {
  id: string;
  author: string;
  avatar_url: string;
  body: string;
  date: string;
  filepath: string;
  repo: string;
  created_at?: string;
  resolved: boolean;
};

const repoName = "revision";

function CommentsView() {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const vscode = window.acquireVsCodeApi();

    vscode.postMessage({ command: "requestTokens" });

    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.command === "sendTokens") {
        setJwtToken(message.jwt);

        axios
          .get("https://revision.duckdns.org/api/v1/comments", {
            params: {
              repo: repoName,
            },
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then(function (res) {
            setComments(res.data);
          })
          .catch((err) => {
            console.error("Error fetching comments:", err);
            vscode.postMessage({
              command: "error",
              message: "Failed to fetch comments. Please try again later.",
            });
          });
      }
    });
  }, [jwtToken]);

  return (
    <div className="flex-col">
      {comments.map((comment) => (
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
