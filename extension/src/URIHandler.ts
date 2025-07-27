import * as vscode from "vscode";

export class URIHandler implements vscode.UriHandler {
  handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
    if (uri.path === "/auth") {
      const params = new URLSearchParams(uri.query);
      const jwt = params.get("token");
      const githubToken = params.get("github");

      if (jwt) {
        vscode.window.showInformationMessage(
          `Successfully authenticated with Revision backend.`
        );
        vscode.workspace
          .getConfiguration()
          .update("revision.accessToken", jwt, true);
      } else {
        vscode.window.showErrorMessage("JWT missing from auth redirect.");
      }

      if (githubToken) {
        vscode.workspace
          .getConfiguration()
          .update("revision.githubToken", githubToken, true);
      } else {
        vscode.window.showErrorMessage(
          "Access Token missing from auth redirect."
        );
      }
    }
  }
}
