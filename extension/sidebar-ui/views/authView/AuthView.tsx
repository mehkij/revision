import AuthButton from "./components/AuthButton";
import GitHubLogo from "./components/GitHubLogo";

function AuthView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <GitHubLogo height={64} width={64} />
      <AuthButton />
    </div>
  );
}

export default AuthView;
