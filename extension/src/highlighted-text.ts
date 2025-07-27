import * as vscode from 'vscode';

interface highlightedObj {
    startLinePos: number,
    startCharPos: number,
    endLinePos: number,
    endCharPos: number,
    text: String
}



export function highlightedFunc() {
    const url = "https://revision.duckdns.org/";
    const axios = require('axios').default;

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Undefined editor');
        return;
    }

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