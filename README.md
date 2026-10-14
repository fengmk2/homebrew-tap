# Tap moved to Projj Desktop

The Homebrew cask now lives in [fengmk2/projj-desktop](https://github.com/fengmk2/projj-desktop/tree/main/Casks). Its release workflow publishes the app and updates the cask in the same repository. This repository is retained as an archive and receives no further releases or scheduled updates.

For a new installation:

```sh
brew tap fengmk2/projj-desktop https://github.com/fengmk2/projj-desktop.git
brew install --cask fengmk2/projj-desktop/projj-desktop
```

If you installed the app through this tap, migrate to the dedicated tap:

```sh
brew uninstall --cask fengmk2/tap/projj-desktop
brew untap fengmk2/tap
brew tap fengmk2/projj-desktop https://github.com/fengmk2/projj-desktop.git
brew install --cask fengmk2/projj-desktop/projj-desktop
```

This reinstalls the app and CLI while preserving `~/.projj` configuration and your repositories. Future updates use:

```sh
brew update
brew upgrade --cask fengmk2/projj-desktop/projj-desktop
```

See the [installation instructions](https://github.com/fengmk2/projj-desktop#homebrew-macos) for platform requirements and options.
