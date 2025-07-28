import * as vscode from "vscode";
import { getNonce } from "./utils/getNonce";

export class AuthViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.getHtml(webviewView.webview);

    const clientID = "Ov23liCMiYF5035lKJEQ";
    const redirectUri = "vscode://revision/auth/callback";
    const authURL = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=repo`;

    webviewView.webview.onDidReceiveMessage(async (message) => {
      console.log("AuthViewProvider received message:", message);

      if (message.command === "startOAuth") {
        vscode.env.openExternal(vscode.Uri.parse(authURL));
      }
    });
  }

  private getHtml(webview: vscode.Webview): string {
    const webviewURI = (file: string) =>
      webview.asWebviewUri(
        vscode.Uri.joinPath(this.context.extensionUri, "media", file)
      );

    const scriptURI = webviewURI("assets/auth/index.js");
    const stylesURI = webviewURI("assets/index/index.css");
    const githubLogoURI = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "github-mark.svg")
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy"
              content="default-src 'none';
              img-src ${webview.cspSource};
              script-src 'nonce-${nonce}' ${webview.cspSource}; style-src 'unsafe-inline' ${webview.cspSource};">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="${stylesURI}">
        <title>Revision</title>
      </head>
      <body>
        <div id="root"></div>
        <script nonce=${nonce}>
          window.GITHUB_LOGO_URI = "${githubLogoURI}"
        </script>
        <script type="module" src="${scriptURI}" nonce="${nonce}"></script>
      </body>
      </html>`;
  }

  public sendAuthTokens(githubToken: string) {
    console.log("sendAuthTokens called with:", {
      githubToken: !!githubToken,
    });

    // Save token to globalState
    this.context.globalState.update("githubToken", githubToken);

    this._view?.webview.postMessage({
      command: "authTokens",
      githubToken,
    });
  }
}
