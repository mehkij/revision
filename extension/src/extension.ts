// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getNonce } from "./getNonce";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const provider = new CommentsViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("commentsView", provider)
  );
}

class CommentsViewProvider implements vscode.WebviewViewProvider {
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
    });
  }

  private getHtml(webview: vscode.Webview): string {
    const webviewURI = (file: string) =>
      webview.asWebviewUri(
        vscode.Uri.joinPath(this.context.extensionUri, "media", file)
      );

    const scriptURI = webviewURI("assets/index.js");
    const stylesURI = webviewURI("assets/main.css");

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
        <script type="module" src="${scriptURI}" nonce="${nonce}"></script>
      </body>
      </html>`;
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
