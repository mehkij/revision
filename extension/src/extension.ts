// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CommentsViewProvider } from "./CommentsViewProvider";
import { AuthViewProvider } from "./AuthViewProvider";
import { URIHandler } from "./URIHandler";

import { highlightedFunc } from "./highlighted-text";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const commentsProvider = new CommentsViewProvider(context);
  const authProviderInstance = new AuthViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("commentsView", commentsProvider),
    vscode.window.registerWebviewViewProvider("authView", authProviderInstance),
    vscode.window.registerUriHandler(new URIHandler())
  );
  const command = "revision.makecomment";

  const commandHandler = highlightedFunc;

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(command, commandHandler);

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
