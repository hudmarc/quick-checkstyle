import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('quick-checkstyle is now active!');

	let disposable = vscode.commands.registerCommand('quick-checkstyle.check-all', (uri: vscode.Uri) => {

		if (vscode.workspace.workspaceFolders !== undefined) {

			const config = vscode.workspace.getConfiguration('quick-checkstyle');
			const classPath = config.get("checkstyle-class-path");
			var additionalArgs = config.get("additional-checkstyle-arguments");
			if (additionalArgs !== undefined && additionalArgs !== "") {
				additionalArgs = " " + additionalArgs;
			} 

			if (classPath === undefined || classPath === "") {
				vscode.window.showErrorMessage('No Checkstyle installation found! Set `quick-checkstyle.checkstyle-class-path` to the path to your checkstyle `.jar` file.');
				return;
			}
			
			let terminal = vscode.window.terminals.find(term => term.name === "checkstyle");
			
			if (terminal === undefined) {
				terminal = vscode.window.createTerminal("checkstyle");
			}

			terminal?.show();

			vscode.window.showInformationMessage(`Checking all Java files using ${uri.fsPath}`);

			terminal?.sendText("clear");

			terminal?.sendText(`java -jar "${classPath}" -c "${uri.fsPath}" "${vscode.workspace.workspaceFolders[0].uri.fsPath}"${additionalArgs}`);
		}

	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
