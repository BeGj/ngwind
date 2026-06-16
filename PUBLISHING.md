# Publishing `ngwind`

The library (`projects/ui`) is published to npm as **[`ngwind`](https://www.npmjs.com/package/ngwind)**.
Releases are automated with [release-please](https://github.com/googleapis/release-please) and
published from GitHub Actions using **npm OIDC trusted publishing** (no long-lived tokens), with
build provenance.

## How a normal release works

1. Land changes on `main` using [Conventional Commits](https://www.conventionalcommits.org/)
   (`feat:`, `fix:`, `feat!:`/`BREAKING CHANGE:`, …).
2. `release-please` (in [`.github/workflows/release.yml`](.github/workflows/release.yml)) opens and
   keeps a **"chore: release ngwind"** PR that bumps `projects/ui/package.json` and updates
   `projects/ui/CHANGELOG.md`.
3. **Merge that PR.** release-please tags `vX.Y.Z` and creates the matching **GitHub Release**.
4. That triggers the `publish` job, which — only after `format:check`, `lint`, `ng build ui`, and the
   tests pass — runs `npm publish ./dist/ui --provenance --access public`.

You never bump versions or edit the changelog by hand.

## One-time setup (required before the first automated release)

npm trusted publishing is configured on the package's settings page, which **requires the package to
already exist**. So the very first publish is manual; every release after that is automated.

1. **Create the GitHub repo** `BeGj/ngwind`, set `main` as the default branch, and push this code.
2. **Bootstrap the first publish locally** (creates `ngwind@0.1.0` on npm):

   ```bash
   pnpm install
   pnpm build:lib                 # builds the library AND the ng-add/ng-update schematics
   npm login                      # or use an automation token just for this step
   npm publish ./dist/ui --access public   # no --provenance: it only works from CI/OIDC
   git tag v0.1.0 && git push --tags   # anchors release-please to 0.1.0
   ```

   > This first publish has **no provenance** — provenance can only be generated from a supported
   > CI provider (GitHub Actions OIDC), not a local machine. That's expected: the release workflow
   > passes `--provenance` so every _automated_ release is signed. (This is why the package's
   > `publishConfig` does **not** set `provenance: true` — that would force it on the local publish
   > too and fail with `Automatic provenance generation not supported for provider: null`.)

3. **Configure the trusted publisher** on npm: npmjs.com → the `ngwind` package → _Settings_ →
   _Trusted Publisher_ → GitHub Actions, with:
   - Repository: `BeGj/ngwind`
   - Workflow filename: `release.yml`
4. Done. From now on, merging a release-please PR publishes automatically via OIDC — no token needed.

> Prefer a token instead of OIDC? Add an npm automation token as the `NPM_TOKEN` repository secret,
> set `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` on the `publish to npm` step, and drop the
> `id-token: write` permission.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every PR and push to `main`:
`format:check` → `lint` → `ng build ui` → tests. The same gates run again in the publish job, so a
broken build can never be released.
