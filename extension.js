const vscode = require('vscode');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Variable to store the content from the last POST request.
let storedContent = '';

app.post('/update', (req, res) => {
    // Save the content from the POST request, but don't update the file yet.
    storedContent = req.body.content;
    console.log(storedContent);
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Extension server listening on port 3000');
});

function activate(context) {
    console.log('Extension is now active!');

    let insertComments = vscode.commands.registerCommand('extension.insertComments', () => {
        // Insert the stored content into the active text editor when the command is invoked.
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor!');
            return;
        }
        let document = editor.document;

        // Compute the position at the end of the document.
        let lastLine = document.lineAt(document.lineCount - 1);
        let endOfDocument = new vscode.Position(lastLine.lineNumber, lastLine.text.length);

        editor.edit(editBuilder => {
            // Append the stored content at the end of the document.
            editBuilder.insert(endOfDocument, '\n' + storedContent);
        });
    });

    context.subscriptions.push(insertComments);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
