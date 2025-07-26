// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CommentsViewProvider } from "./ViewProvider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const provider = new CommentsViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("commentsView", provider)
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
