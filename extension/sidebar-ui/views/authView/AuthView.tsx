import GitHubLogo from "./components/GitHubLogo";

function AuthView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <GitHubLogo height={64} width={64} />
      <button className="mt-6">Sign in with GitHub</button>
    </div>
  );
}

export default AuthView;
