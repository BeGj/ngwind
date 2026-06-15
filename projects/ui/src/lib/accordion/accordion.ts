import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';

/**
 * Tailwind-styled accordion built on `@angular/aria/accordion`. The Aria
 * primitives handle expand/collapse state, keyboard navigation, and ARIA
 * attributes; this wrapper supplies the styling and wires the trigger/panel
 * relationship internally so consumers never deal with template refs.
 *
 * @example
 * ```html
 * <tw-accordion [multiExpandable]="false">
 *   <tw-accordion-item>
 *     <span tw-accordion-header>Shipping</span>
 *     <p>Ships in 2-3 business days.</p>
 *   </tw-accordion-item>
 * </tw-accordion>
 * ```
 */
@Directive({
  selector: 'tw-accordion',
  hostDirectives: [{ directive: AccordionGroup, inputs: ['multiExpandable', 'disabled', 'wrap'] }],
  host: {
    class:
      'block divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 ' +
      'dark:divide-slate-700 dark:border-slate-700',
  },
})
export class TwAccordion {}

@Component({
  selector: 'tw-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccordionTrigger, AccordionPanel, AccordionContent],
  host: { class: 'block' },
  template: `
    <h3 class="m-0">
      <button
        ngAccordionTrigger
        [panel]="panel"
        class="group flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left
               text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50
               focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600
               aria-disabled:cursor-not-allowed aria-disabled:opacity-40 dark:text-slate-100
               dark:hover:bg-slate-800"
      >
        <ng-content select="[tw-accordion-header]" />
        <svg
          class="size-4 shrink-0 text-slate-400 transition-transform duration-200
                 group-aria-[expanded=true]:rotate-180"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </h3>
    <div ngAccordionPanel #panel="ngAccordionPanel" class="block">
      <ng-template ngAccordionContent>
        <div class="px-4 pb-4 pt-1 text-sm text-slate-600 dark:text-slate-300">
          <ng-content />
        </div>
      </ng-template>
    </div>
  `,
})
export class TwAccordionItem {}
