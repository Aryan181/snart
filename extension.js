const vscode = require('vscode');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/update', (req, res) => {
    const content = req.body.content;
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor!');
        return;
    }
    let document = editor.document;
    let fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
    );
    editor.edit(editBuilder => {
        editBuilder.replace(fullRange, content);
    });
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Extension server listening on port 3000');
});

function activate(context) {
    console.log('Extension is now active!');
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
