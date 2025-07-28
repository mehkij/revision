import * as vscode from "vscode";
import { getAuthProvider } from "./extension";

export class URIHandler implements vscode.UriHandler {
  handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
    if (uri.path === "/auth/callback") {
      const params = new URLSearchParams(uri.query);
      const githubToken = params.get("github");

      if (githubToken) {
        vscode.window.showInformationMessage(
          `Successfully authenticated with GitHub.`
        );

        // Store only the GitHub token
        vscode.workspace
          .getConfiguration()
          .update("revision.githubToken", githubToken, true);

        // Send token to auth provider
        getAuthProvider()?.sendAuthTokens(githubToken);
      } else {
        vscode.window.showErrorMessage(
          "GitHub token missing from auth redirect."
        );
      }
    }
  }
}
