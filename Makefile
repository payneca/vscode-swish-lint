.PHONY: all clean install pristine

all: swish-lint-1.0.0.vsix

%.vsix: package.json src/extension.ts
	vsce package

install: swish-lint-1.0.0.vsix
	code --install-extension swish-lint-1.0.0.vsix

clean:
	rm -rf out
	rm -f swish-lint-1.0.0.vsix

pristine: clean
	rm -rf node_modules
