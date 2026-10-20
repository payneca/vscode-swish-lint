import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

function createClient(): LanguageClient {
  const config = vscode.workspace.getConfiguration('swish-lint');
  const command = config.get<string>('path', 'swish-lint');
  const args = config.get<string[]>('args', ['--lsp']);

  const serverOptions: ServerOptions = {
    command,
    args,
    transport: TransportKind.stdio,
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'scheme' },
      { scheme: 'untitled', language: 'scheme' },
    ],
  };

  return new LanguageClient('swish-lint', 'Swish-Lint', serverOptions, clientOptions);
}

async function startClient(): Promise<void> {
  client = createClient();
  try {
    await client.start();
  } catch (err) {
    const command = vscode.workspace.getConfiguration('swish-lint').get<string>('path');
    vscode.window.showErrorMessage(
      `Swish-Lint: failed to start language server "${command}": ${err instanceof Error ? err.message : err}`,
    );
  }
}

async function stopClient(): Promise<void> {
  if (client) {
    const c = client;
    client = undefined;
    try {
      await c.stop();
    } catch {
      // The server may never have started.
    }
  }
}

async function restartClient(): Promise<void> {
  await stopClient();
  await startClient();
}

// In Emacs, pressing tab on the line indents it. If the cursor was
// in the leading whitespace, the cursor moves to the first
// non-whitespace character. Otherwise the cursor is untouched.
async function indentLine(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const originalPos = editor.selection.active;
  const line = editor.document.lineAt(originalPos.line);
  const wasInLeadingWhitespace = originalPos.character <= line.firstNonWhitespaceCharacterIndex;

  const edits = await vscode.commands.executeCommand<vscode.TextEdit[]>(
    'vscode.executeFormatOnTypeProvider',
    editor.document.uri,
    originalPos,
    '\t',
    {},
  );
  if (edits?.length) {
    await editor.edit((builder) => {
      for (const edit of edits) {
        builder.replace(edit.range, edit.newText);
      }
    });
  }
  if (wasInLeadingWhitespace) {
    const newLine = editor.document.lineAt(originalPos.line);
    const pos = new vscode.Position(originalPos.line, newLine.firstNonWhitespaceCharacterIndex);
    editor.selection = new vscode.Selection(pos, pos);
  }
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  context.subscriptions.push(
    vscode.commands.registerCommand('swish-lint.restart', restartClient),
    vscode.commands.registerCommand('swish-lint.indentLine', indentLine),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('swish-lint.path') || e.affectsConfiguration('swish-lint.args')) {
        restartClient();
      }
    }),
  );
  await startClient();
}

export function deactivate(): Thenable<void> | undefined {
  return stopClient();
}
