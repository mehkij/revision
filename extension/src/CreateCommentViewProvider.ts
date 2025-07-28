import * as vscode from "vscode";
import { getNonce } from "./utils/getNonce";
import axios from "axios";

export class CreateCommentViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.getHtml(webviewView.webview);

    // Listen to messages from the webview (e.g., to add a comment)
    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (message.command === "addComment") {
        try {
          const response = await axios.post(
            "https://revision.duckdns.org/api/v1/comments",
            message.data,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // If the response status is not 2xx, throw an error
          if (response.status < 200 || response.status >= 300) {
            throw new Error(`Server responded with status ${response.status}`);
          }

          // Notify the webview that the comment was added successfully
          webviewView.webview.postMessage({ command: "commentAdded" });
        } catch (err: unknown) {
          let errorMessage = "Unknown error";

          if (err instanceof Error) {
            errorMessage = err.message;
          } else if (typeof err === "string") {
            errorMessage = err;
          }

          console.error("Error forwarding comment:", errorMessage);
          vscode.window.showErrorMessage(
            "Failed to add comment: " + errorMessage
          );

          webviewView.webview.postMessage({
            command: "error",
            message: errorMessage,
          });
        }
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

    const scriptURI = webviewURI("assets/createComment/index.js");
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
