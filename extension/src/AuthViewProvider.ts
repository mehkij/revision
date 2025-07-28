import * as vscode from "vscode";
import { getNonce } from "./utils/getNonce";

export class AuthViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) { }

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.getHtml(webviewView.webview);

    const clientID = "Ov23liCMiYF5035lKJEQ";
    const redirectUri = "vscode://revision/auth/callback"; // or your deployed URL
    const authURL = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=repo`;

    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (message.command === "startOAuth") {
        vscode.env.openExternal(vscode.Uri.parse(authURL));
      }

      if (message.command === "readyForTokens") {
        // Send stored tokens to webview
        const jwt = this.context.globalState.get<string>("jwtToken");
        const githubToken = this.context.globalState.get<string>("githubToken");
        webviewView.webview.postMessage({
          command: "setTokens",
          jwt,
          githubToken,
        });
      }

      if (message.command === "saveTokens") {
        this.context.globalState.update("jwtToken", message.jwt);
        this.context.globalState.update("githubToken", message.githubToken);
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

  public sendAuthTokens(jwtToken: string, githubToken: string) {
    // Save tokens to globalState
    this.context.globalState.update("jwtToken", jwtToken);
    this.context.globalState.update("githubToken", githubToken);

    this._view?.webview.postMessage({
      command: "authTokens",
      jwtToken,
      githubToken,
    });
  }
}
