// Post-build step for the `ngwind` package.
//
// ng-packagr emits `"type": "module"` in dist/ui/package.json. The library is
// entirely ESM by file extension (fesm2022/*.mjs) plus an `exports` map, so the
// field is redundant for consumers — but it would force the CommonJS `ng-add` /
// `ng-update` schematics (plain *.js) to be parsed as ESM and fail to load. The
// usual fix is a nested `schematics/package.json` { "type": "commonjs" }, but
// npm-packlist strips nested package.json files from `npm publish`, so we drop
// `type` here instead. Result: *.mjs stay ESM, schematics/*.js resolve as CJS.
import { readFileSync, writeFileSync } from 'node:fs';

const pkgPath = new URL('../dist/ui/package.json', import.meta.url);
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

if (pkg.type === 'module') {
  delete pkg.type;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('finalize-lib-package: removed "type":"module" from dist/ui/package.json');
} else {
  console.log('finalize-lib-package: no "type":"module" to remove (already done).');
}
