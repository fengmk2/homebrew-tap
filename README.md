# Tap moved to Projj Desktop

The Homebrew cask now lives in [fengmk2/projj-desktop](https://github.com/fengmk2/projj-desktop/tree/main/Casks). Its release workflow publishes the app and updates the cask in the same repository. This repository is retained as an archive and receives no further releases or scheduled updates.

For a new installation:

```sh
brew tap fengmk2/tap https://github.com/fengmk2/projj-desktop.git
brew install --cask fengmk2/tap/projj-desktop
```

If you already use this tap, replace its checkout first:

```sh
brew tap --custom-remote fengmk2/tap https://github.com/fengmk2/projj-desktop.git
brew update-reset "$(brew --repository fengmk2/tap)"
brew install --cask fengmk2/tap/projj-desktop
```

This replaces the tap checkout, including any local cask edits. It preserves the installed app, CLI, `~/.projj` configuration, and your repositories. Future updates use the same command:

```sh
brew update
brew upgrade --cask fengmk2/tap/projj-desktop
```

See the [installation instructions](https://github.com/fengmk2/projj-desktop#homebrew-macos) for platform requirements and options.
