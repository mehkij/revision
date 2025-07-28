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
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <GitHubLogo height={64} width={64} />
      <AuthButton vscode={vscode} />
    </div>
  );
}

export default AuthView;
