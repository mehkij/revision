declare global {
  interface Window {
    acquireVsCodeApi?: () => { postMessage: (msg: unknown) => void };
  }
}

type CreateCommentButtonProps = {
  vscode?: { postMessage: (msg: unknown) => void };
  onClick?: () => void;
  loading?: boolean;
};

function CreateCommentButton({
  vscode,
  onClick,
  loading,
}: CreateCommentButtonProps) {
  const handleClick = () => {
    if (!vscode) {
      console.error("VSCode API is not available");
      return;
    }

    vscode.postMessage({ command: "postComment" });

    onClick?.();
  };
  return (
    <button className="mt-6" onClick={handleClick} disabled={loading}>
      {loading ? "Submitting..." : "Create Comment"}
    </button>
  );
}

export default CreateCommentButton;
