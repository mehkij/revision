declare global {
  interface Window {
    acquireVsCodeApi?: () => { postMessage: (msg: unknown) => void };
  }
}

function AuthButton() {
  const handleClick = () => {
    // @ts-ignore
    if (window.acquireVsCodeApi) {
      window.acquireVsCodeApi().postMessage({ command: "startOAuth" });
    }
  };

  return (
    <button className="mt-6" onClick={handleClick}>
      Sign in with GitHub
    </button>
  );
}

export default AuthButton;
