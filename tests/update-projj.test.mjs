import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { releaseVersion, updateCask } from "../scripts/update-projj.mjs";

const current = readFileSync(new URL("../Casks/projj-desktop.rb", import.meta.url), "utf8")
  .replace(/^  version "[^"]+"$/m, '  version "0.0.0"');

function fixture(version = "0.1.0") {
  const assets = ["arm64", "x86_64"].map((arch, index) => {
    const name = `Projj-v${version}-macOS-${arch}.zip`;
    return {
      name,
      browser_download_url: `https://github.com/fengmk2/projj-desktop/releases/download/v${version}/${name}`,
      digest: `sha256:${String(index + 1).repeat(64)}`,
    };
  });
  return {
    release: { tag_name: `v${version}`, draft: false, prerelease: false, assets },
    sums: assets.map((asset) => `${asset.digest.slice(7)}  ${asset.name}`).join("\n") + "\n",
  };
}

test("updates both architectures and is idempotent", () => {
  const { release, sums } = fixture();
  const updated = updateCask(current, release, sums);
  assert.match(updated, /version "0\.1\.0"/);
  assert.ok(updated.includes(`sha256 arm:   "${"1".repeat(64)}"`));
  assert.ok(updated.includes(`intel: "${"2".repeat(64)}"`));
  assert.equal(updateCask(updated, release, sums), updated);
});

test("rejects drafts, prereleases, and invalid version strings", () => {
  const { release } = fixture();
  for (const change of [
    { draft: true }, { prerelease: true }, { tag_name: "v1.0.0-rc.1" },
    { tag_name: "v01.0.0" }, { tag_name: 'v1.0.0"\nsystem "whoami"' },
    { tag_name: "1.0.0" }, { tag_name: "v1.0.0\n" },
  ]) assert.throws(() => releaseVersion({ ...release, ...change }));
});

test("rejects partial releases, incorrect URLs, and mismatched digests", () => {
  for (const mutate of [
    (release) => release.assets.pop(),
    (release) => release.assets.push(release.assets[0]),
    (release) => { release.assets[0].browser_download_url = "https://example.com/app.zip"; },
    (release) => { release.assets[0].digest = `sha256:${"f".repeat(64)}`; },
  ]) {
    const { release, sums } = fixture();
    mutate(release);
    assert.throws(() => updateCask(current, release, sums), /Missing asset or inconsistent checksum/);
  }
});

test("rejects malformed, missing, or duplicate checksums", () => {
  const { release, sums } = fixture();
  for (const invalid of ["", sums.replace(/^1/, "g"), sums.split("\n")[0], sums + sums]) {
    assert.throws(() => updateCask(current, release, invalid));
  }
});

test("compares versions numerically and refuses downgrades or changed published assets", () => {
  const initial = fixture("0.9.0");
  const old = updateCask(current, initial.release, initial.sums);
  const next = fixture("0.10.0");
  const updated = updateCask(old, next.release, next.sums);
  assert.throws(() => updateCask(updated, initial.release, initial.sums), /downgrade/);
  next.release.assets[0].digest = `sha256:${"f".repeat(64)}`;
  assert.throws(() => updateCask(updated, next.release, next.sums.replaceAll("1".repeat(64), "f".repeat(64))), /Checksums changed/);
});
