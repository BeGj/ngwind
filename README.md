# ng-tailwind-ui

An Angular **UI library** built on [`@angular/cdk`](https://material.angular.dev/cdk) and
[`@angular/aria`](https://angular.dev/), styled with **Tailwind CSS v4**, published to npm as
**[`ngwind`](https://www.npmjs.com/package/ngwind)**. This is an Angular CLI workspace
(Angular 22, pnpm) containing two projects:

| Project             | Type        | Path            | Purpose                                    |
| ------------------- | ----------- | --------------- | ------------------------------------------ |
| [`ui`](projects/ui) | library     | `projects/ui`   | The publishable component library          |
| `demo`              | application | `projects/demo` | Showcase app that consumes & verifies `ui` |

## Components

- **Button** — styled native `<button>`/`<a>` directive (variants + sizes)
- **Card** — surface with header / footer projection slots
- **Dialog** — modal service over `@angular/cdk/dialog` (focus trap, a11y for free)
- **Tooltip** — hover/focus tooltip over `@angular/cdk/overlay`
- **Tabs** — headless `@angular/aria/tabs`, styled with Tailwind
- **Accordion** — headless `@angular/aria/accordion`, styled with Tailwind

See [`projects/ui/README.md`](projects/ui/README.md) for the component API and the **required
consumer Tailwind setup** (`@source` scanning + CDK overlay CSS).

## Install (consumers)

```bash
ng add ngwind
```

`ngwind` ships an `ng-add` schematic that installs the `@angular/cdk` / `@angular/aria` peer
dependencies and wires the Tailwind `@source` scan + CDK overlay CSS into your global stylesheet.
It also declares `ng-update` support for future migrations.

## Releasing

Releases are automated with release-please and published to npm from GitHub Actions via OIDC
trusted publishing. See [`PUBLISHING.md`](PUBLISHING.md) for the flow and one-time setup.

## How styling reaches the library (important)

The library ships **raw Tailwind utility classes** in its templates, not compiled CSS. The
consuming app's Tailwind build must scan the library so those classes are emitted. The demo does
this in [`projects/demo/src/styles.css`](projects/demo/src/styles.css):

```css
@import 'tailwindcss';
@source '../../ui/src/**/*.{html,ts}'; /* scan the library templates */
@import '@angular/cdk/overlay-prebuilt.css'; /* structural CSS for CDK overlays */
```

## Develop

```bash
pnpm install
pnpm build:lib        # build the library + schematics first -> dist/ui (the demo imports `ngwind` from here)
pnpm start            # serve the demo at http://localhost:4200
pnpm ng test demo --no-watch   # unit tests (incl. Aria wrapper wiring)
pnpm lint             # eslint
pnpm format:check     # prettier
```

> Build the library before serving/testing the demo: the path mapping `"ngwind": ["./dist/ui"]`
> (in `tsconfig.json`) resolves the library from its built output. `build:lib` also compiles the
> `ng-add`/`ng-update` schematics shipped in the package.
