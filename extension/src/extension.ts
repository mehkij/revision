// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CommentsViewProvider } from "./CommentsViewProvider";
import { AuthViewProvider } from "./AuthViewProvider";
import { URIHandler } from "./URIHandler";

<<<<<<< HEAD
let authProviderInstance: AuthViewProvider | undefined;

import { highlightedFunc } from "./highlighted-text";
=======
import { highlightedObj } from "./highlighted-text";
>>>>>>> 814e7b4 (added hover function over the highlighted text)
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

<<<<<<< HEAD
export function getAuthProvider(): AuthViewProvider | undefined {
  return authProviderInstance;
=======
  //const commandHandler = highlightedFunc;
  let hoverRange: vscode.Range;
  let highlightObj: highlightedObj;

  const commandHandler = function () {
    const url = "https://revision.duckdns.org/";
    const axios = require('axios').default;

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('Undefined editor');
      return;
    }

    const line_bck_color = 'rgba(98,27,99, 0.92)'
    const outlineDecoration = vscode.window.createTextEditorDecorationType({
      borderColor: line_bck_color,
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '0px',
      backgroundColor: line_bck_color,
      overviewRulerLane: vscode.OverviewRulerLane.Center
    });
    let activeRanges: vscode.Range[] = [];

    const selection = editor.selection;
    if (selection && !selection.isEmpty) {
      const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
      const highlighted = editor.document.getText(selectionRange);
      var highlightedText: highlightedObj = {
        startLinePos: selectionRange.start.line,
        startCharPos: selectionRange.start.character,
        endLinePos: selectionRange.end.line,
        endCharPos: selectionRange.end.character,
        text: highlighted
      };

      highlightObj = highlightedText;

      activeRanges.push(selectionRange);
      hoverRange = selectionRange;
      editor.setDecorations(outlineDecoration, activeRanges);

      console.log(highlightedText);
      axios.post(url + '/api/v1/comments',
        highlightedText)
        .then(function (response: any) {
          console.log(response);
        })
        .catch(function (error: any) {
          console.log(error);
        });
    }
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(command, commandHandler);

  context.subscriptions.push(disposable);

  vscode.languages.registerHoverProvider({ scheme: 'file' }, {
    provideHover(document, position, token) {
      return new vscode.Hover('Placeholder hover text(This is where the comment text will go)', hoverRange);
    }
  });


>>>>>>> 814e7b4 (added hover function over the highlighted text)
}

// This method is called when your extension is deactivated
export function deactivate() { }
