import * as vscode from "vscode";
import { getAuthProvider } from "./extension";

export class URIHandler implements vscode.UriHandler {
  handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
    if (uri.path === "/auth") {
      const params = new URLSearchParams(uri.query);
      const jwt = params.get("token");
      const githubToken = params.get("github");

      if (jwt && githubToken) {
        vscode.window.showInformationMessage(
          `Successfully authenticated with Revision backend.`
        );
        vscode.workspace
          .getConfiguration()
          .update("revision.accessToken", jwt, true);

        vscode.workspace
          .getConfiguration()
          .update("revision.githubToken", githubToken, true);

        getAuthProvider()?.sendAuthTokens(jwt, githubToken);
      } else {
        vscode.window.showErrorMessage("JWT missing from auth redirect.");
      }
    }
  }
}
