# Homebrew tap

Install [Projj Desktop](https://github.com/fengmk2/projj-desktop) on macOS 12 or later, with Apple silicon or Intel:

```sh
brew install --cask fengmk2/tap/projj-desktop
```

This command adds the tap, installs `Projj.app` in `/Applications`, and links the bundled `projj` CLI into Homebrew's `bin` directory. Open **Projj** from Applications or run `open -a Projj`. Git must be available on your system; Node.js and Rust are not required.

If you already manage the `projj` CLI separately, install just the app:

```sh
brew install --cask --no-binaries fengmk2/tap/projj-desktop
```

Update or uninstall:

```sh
brew update
brew upgrade --cask fengmk2/tap/projj-desktop
brew uninstall --cask fengmk2/tap/projj-desktop
```

Uninstalling preserves `~/.projj` and your repositories. The app currently uses an ad-hoc signature and is not notarized. If macOS blocks the first launch, use **System Settings → Privacy & Security → Open Anyway** after reviewing the downloaded app.

## Maintaining the tap

[Update Projj Desktop](.github/workflows/update-projj.yml) checks the latest stable GitHub Release hourly and commits new versions. It uses Node.js 22 built-ins, validates both architecture checksums against `SHA256SUMS` and GitHub's asset digests, and refuses downgrades or changed checksums for an existing version. Prereleases are excluded. Only this repository's `GITHUB_TOKEN` is needed.

To update immediately after publishing a release:

```sh
gh workflow run update-projj.yml --repo fengmk2/homebrew-tap
```

GitHub can delay scheduled jobs and disables schedules in public repositories after 60 days without activity. If disabled, re-enable this workflow in the Actions tab. See [GitHub's schedule documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

To update locally, work in the installed tap's checkout:

```sh
cd "$(brew --repository fengmk2/tap)"
node --test tests/*.test.mjs
node scripts/update-projj.mjs
brew style --cask fengmk2/tap/projj-desktop
```

The CI workflow installs and uninstalls the cask on Apple silicon and Intel macOS runners. The cask intentionally does not remove shared Projj configuration or repository data.
