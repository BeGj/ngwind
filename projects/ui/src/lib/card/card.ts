import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Surface container with optional header and footer slots projected via
 * `[tw-card-header]` and `[tw-card-footer]` selectors.
 *
 * @example
 * ```html
 * <tw-card>
 *   <h3 tw-card-header>Title</h3>
 *   <p>Body content.</p>
 *   <div tw-card-footer>
 *     <button tw-button>Action</button>
 *   </div>
 * </tw-card>
 * ```
 */
@Component({
  selector: 'tw-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    >
      <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-700 empty:hidden">
        <ng-content select="[tw-card-header]" />
      </div>
      <div class="px-5 py-4">
        <ng-content />
      </div>
      <div class="border-t border-slate-200 px-5 py-4 dark:border-slate-700 empty:hidden">
        <ng-content select="[tw-card-footer]" />
      </div>
    </div>
  `,
})
export class TwCard {}
