import { useEffect, useState } from "react";
import AuthButton from "./components/AuthButton";
import GitHubLogo from "./components/GitHubLogo";

function AuthView() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [vscode, setVscode] = useState<any | null>(null);

  useEffect(() => {
    const vscodeApi = window.acquireVsCodeApi?.();
    if (vscodeApi) {
      setVscode(vscodeApi);
      vscodeApi.postMessage({ command: "readyForTokens" });
    }

    const listener = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === "setTokens") {
        vscodeApi?.postMessage({
          command: "saveTokens",
          jwt: message.jwt,
          githubToken: message.githubToken,
        });
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <GitHubLogo height={64} width={64} />
      <AuthButton vscode={vscode} />
    </div>
  );
}

export default AuthView;
