// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CommentsViewProvider } from "./CommentsViewProvider";
import { AuthViewProvider } from "./AuthViewProvider";
import { URIHandler } from "./URIHandler";

let authProviderInstance: AuthViewProvider | undefined;

import { highlightedFunc } from "./highlighted-text";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const commentsProvider = new CommentsViewProvider(context);
  const authProvider = new AuthViewProvider(context);

  authProviderInstance = authProvider;

  const command = "revision.makecomment";
  const commandHandler = highlightedFunc;
  const disposable = vscode.commands.registerCommand(command, commandHandler);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("commentsView", commentsProvider),
    vscode.window.registerWebviewViewProvider("authView", authProvider),
    vscode.window.registerUriHandler(new URIHandler()),
    disposable
  );
}

export function getAuthProvider(): AuthViewProvider | undefined {
  return authProviderInstance;
}

// This method is called when your extension is deactivated
export function deactivate() {}
