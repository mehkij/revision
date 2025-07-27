declare global {
  interface Window {
    acquireVsCodeApi?: () => { postMessage: (msg: unknown) => void };
  }
}

type AuthButtonProps = {
  vscode?: { postMessage: (msg: unknown) => void };
};

function AuthButton({ vscode }: AuthButtonProps) {
  const handleClick = () => {
    if (!vscode) {
      console.error("VSCode API is not available");
      return;
    }

    vscode.postMessage({ command: "startOAuth" });
  };
  return (
    <button className="mt-6" onClick={handleClick}>
      Sign in with GitHub
    </button>
  );
}

export default AuthButton;
