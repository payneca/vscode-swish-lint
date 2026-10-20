# Swish-Lint for VS Code extension

Integrates [Swish-Lint](https://github.com/becls/swish-lint) into VS
Code by acting as a [LSP](https://langserver.org) client in the
`scheme` language (e.g. `.ss` and `.ms` files).

## Features

The Swish-Lint language server supports linting, code completion
suggestions, etc. for Swish/Scheme applications.

## Requirements

Swish-Lint is currently an external dependency and not packaged with
this extension. Build Swish-Lint and add it to your `PATH` or set
`swish-lint.path` to its location.

## Installing

Run `make install` at a command prompt.

Open a Scheme project in VS Code. Set the Output window to
"Swish-Lint" to see initialization diagnostics.

To verify everything is working, go to the `Output` window and switch to
`Swish-Lint`. The version number should be displayed. `define`
expressions should be in color.

## Settings

| Setting                   | Default        | Description                                    |
|---------------------------|----------------|------------------------------------------------|
| `swish-lint.path`         | `"swish-lint"` | Path to the swish-lint executable.             |
| `swish-lint.args`         | `["--lsp"]`    | Arguments used to start the language server.   |
| `swish-lint.trace.server` | `"off"`        | Trace LSP traffic (`messages` or `verbose`) to the Swish-Lint output channel. |

Changing `swish-lint.path` or `swish-lint.args` restarts the
server. You can also restart it with **Swish-Lint: Restart Server**
from the command palette.

## Configure VS Code

1. Enable **Settings | Text Editor | Formatting | Format On Type**.

   ```json
   "editor.formatOnType": true
   ```

2. Add a custom keyboard shortcut for TAB to `keybindings.json`
   (**Preferences: Open Keyboard Shortcuts (JSON)**). Like Emacs, TAB then
   indents the current line, moving the cursor to the first non-whitespace
   character if it was in the leading whitespace.

   ```json
   {
     "key": "tab",
     "command": "swish-lint.indentLine",
     "when": "editorTextFocus && editorLangId == scheme && !editorHasSelection && !suggestWidgetVisible && !inSnippetMode && !inlineSuggestionVisible"
   }
   ```

## Building

```sh
npm install
npm run package
code --install-extension swish-lint-*.vsix
```

Or use `make && make install`.

For development, open this folder in VS Code and press F5 to launch an
Extension Development Host.
