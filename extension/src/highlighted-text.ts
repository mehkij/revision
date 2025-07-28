import * as vscode from 'vscode';

export interface highlightedObj {
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

        activeRanges.push(selectionRange);
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