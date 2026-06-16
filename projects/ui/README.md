# ngwind

A small Angular component library built on [`@angular/cdk`](https://material.angular.dev/cdk)
and [`@angular/aria`](https://angular.dev/), styled with **Tailwind CSS v4** utility classes.

**[Live demo →](https://begj.github.io/ngwind/)**

| Component | Built on                  | Selector(s)                                                     |
| --------- | ------------------------- | --------------------------------------------------------------- |
| Button    | native element            | `button[tw-button]`, `a[tw-button]`                             |
| Card      | content projection        | `tw-card` (+ `[tw-card-header]`, `[tw-card-footer]`)            |
| Dialog    | `@angular/cdk/dialog`     | `TwDialog` service (+ title/content/actions directives)         |
| Tooltip   | `@angular/cdk/overlay`    | `[twTooltip]`                                                   |
| Tabs      | `@angular/aria/tabs`      | `tw-tabs`, `tw-tab-list`, `button[tw-tab]`, `[tw-tab-panel]`    |
| Accordion | `@angular/aria/accordion` | `tw-accordion`, `tw-accordion-item` (+ `[tw-accordion-header]`) |

## Installation

```bash
ng add ngwind
```

That's it. `ng add ngwind` installs the `@angular/cdk` and `@angular/aria` peer dependencies and
configures your global stylesheet automatically (see [Required setup](#required-setup) for what it
wires up). Requires Tailwind CSS v4 to already be set up in your app.

<details>
<summary>Manual installation (if you prefer not to use the schematic)</summary>

```bash
pnpm add ngwind @angular/cdk @angular/aria
```

Then apply the [Required setup](#required-setup) below by hand.

</details>

## Required setup

The library ships **raw Tailwind utility classes** in its templates rather than compiled CSS.
Those classes only become real CSS when **your app's** Tailwind build scans the library, and the
CDK overlays need structural CSS. `ng add ngwind` adds both lines for you; if you installed
manually, add them to your global stylesheet (e.g. `src/styles.css`):

```css
@import 'tailwindcss';

/* 1. Let Tailwind scan this library so its utility classes are emitted. */
@source '../node_modules/ngwind/**/*.mjs';

/* 2. Structural CSS for CDK overlays (Dialog + Tooltip positioning & backdrop). */
@import '@angular/cdk/overlay-prebuilt.css';
```

Without (1) buttons/cards/etc. render unstyled. Without (2) the Dialog and Tooltip overlays
appear mispositioned with no backdrop.

> In this repo's `demo` app the `@source` points at the library **source**
> (`../../ui/src/**/*.{html,ts}`) because it consumes the library from `dist/` within the
> same workspace. An external consumer points it at `node_modules/ngwind` instead.

## Usage

### Button

```html
<button tw-button variant="primary" size="md">Save</button>
<button tw-button variant="destructive" [disabled]="true">Delete</button>
<a tw-button variant="outline" href="/docs">Docs</a>
```

Variants: `primary | secondary | outline | ghost | destructive`. Sizes: `sm | md | lg`.

### Card + Tooltip

```html
<tw-card>
  <h3 tw-card-header>Title</h3>
  <p>Body content.</p>
  <div tw-card-footer>
    <button tw-button twTooltip="Saves your changes" tooltipPosition="above">Save</button>
  </div>
</tw-card>
```

Tooltip positions: `above | below | left | right`.

### Dialog

```ts
import { TwDialog } from 'ngwind';

private readonly dialog = inject(TwDialog);

open() {
  const ref = this.dialog.open<boolean>(ConfirmDialog, { data: { /* ... */ } });
  ref.closed.subscribe((result) => { /* ... */ });
}
```

Inside the dialog component use `[tw-dialog-title]`, `[tw-dialog-content]`, and
`[tw-dialog-actions]`, and inject `DialogRef` / `DIALOG_DATA` (re-exported from `ngwind`).

### Tabs

```html
<tw-tabs>
  <tw-tab-list [(selectedTab)]="active">
    <button tw-tab value="a">Tab A</button>
    <button tw-tab value="b">Tab B</button>
  </tw-tab-list>
  <div tw-tab-panel value="a">Panel A</div>
  <div tw-tab-panel value="b">Panel B</div>
</tw-tabs>
```

### Accordion

```html
<tw-accordion [multiExpandable]="false">
  <tw-accordion-item>
    <span tw-accordion-header>Section title</span>
    <p>Section content.</p>
  </tw-accordion-item>
</tw-accordion>
```

## Building

```bash
pnpm ng build ui      # build the library -> dist/ui
pnpm start            # run the demo showcase app
```
