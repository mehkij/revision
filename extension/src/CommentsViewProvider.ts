import * as vscode from "vscode";
import { getNonce } from "./utils/getNonce";

export class CommentsViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.getHtml(webviewView.webview);

    // Listen to messages from the webview (e.g., to add a comment)
    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command === "addComment") {
        console.log("Add comment:", message.data);
        // Send to Go backend via fetch or WebSocket
      }

      if (message.command === "error") {
        vscode.window.showErrorMessage(message.message);
      }
    });
  }

  private getHtml(webview: vscode.Webview): string {
    const webviewURI = (file: string) =>
      webview.asWebviewUri(
        vscode.Uri.joinPath(this.context.extensionUri, "media", file)
      );

    const scriptURI = webviewURI("assets/comments/index.js");
    const stylesURI = webviewURI("assets/index/index.css");

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy"
              content="default-src 'none';
              img-src ${webview.cspSource};
              script-src 'nonce-${nonce}' ${webview.cspSource}; style-src 'unsafe-inline' ${webview.cspSource}; connect-src https:;">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="${stylesURI}">
        <title>Revision</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="${scriptURI}" nonce="${nonce}"></script>
      </body>
      </html>`;
  }
}
