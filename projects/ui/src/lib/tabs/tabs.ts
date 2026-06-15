import { Directive } from '@angular/core';
import { Tab, TabList, TabPanel, Tabs } from '@angular/aria/tabs';

/**
 * Tailwind-styled tabs built on the headless `@angular/aria/tabs` primitives.
 * Aria owns keyboard navigation, roving tabindex, and ARIA wiring; these
 * directives layer on the visual styling via `hostDirectives` composition.
 *
 * @example
 * ```html
 * <tw-tabs>
 *   <tw-tab-list [(selectedTab)]="active">
 *     <button tw-tab value="profile">Profile</button>
 *     <button tw-tab value="security">Security</button>
 *   </tw-tab-list>
 *   <div tw-tab-panel value="profile">Profile content</div>
 *   <div tw-tab-panel value="security">Security content</div>
 * </tw-tabs>
 * ```
 */
@Directive({
  selector: 'tw-tabs',
  hostDirectives: [Tabs],
  host: { class: 'block' },
})
export class TwTabs {}

@Directive({
  selector: 'tw-tab-list',
  hostDirectives: [
    {
      directive: TabList,
      inputs: ['selectedTab', 'orientation', 'wrap', 'disabled'],
      outputs: ['selectedTabChange'],
    },
  ],
  host: { class: 'flex gap-1 border-b border-slate-200 dark:border-slate-700' },
})
export class TwTabList {}

@Directive({
  selector: 'button[tw-tab]',
  hostDirectives: [{ directive: Tab, inputs: ['value', 'disabled', 'id'] }],
  host: {
    class:
      'cursor-pointer border-b-2 border-transparent px-4 py-2 text-sm font-medium text-slate-500 ' +
      'transition-colors hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 ' +
      'focus-visible:outline-indigo-600 aria-selected:border-indigo-600 aria-selected:text-indigo-600 ' +
      'aria-disabled:cursor-not-allowed aria-disabled:opacity-40 dark:text-slate-400 ' +
      'dark:hover:text-slate-200 dark:aria-selected:border-indigo-400 dark:aria-selected:text-indigo-400',
  },
})
export class TwTab {}

@Directive({
  selector: '[tw-tab-panel]',
  hostDirectives: [{ directive: TabPanel, inputs: ['value', 'id'] }],
  host: {
    class: 'block py-4 text-sm text-slate-700 focus-visible:outline-none dark:text-slate-200',
  },
})
export class TwTabPanel {}
