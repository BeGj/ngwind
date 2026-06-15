import { Directive, booleanAttribute, computed, input } from '@angular/core';

export type TwButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type TwButtonSize = 'sm' | 'md' | 'lg';

/**
 * Full, literal Tailwind class strings per variant/size. They are written out in
 * full (no string concatenation) so the consuming app's Tailwind scanner can
 * statically detect every class via the `@source` directive.
 */
const VARIANT_CLASSES: Record<TwButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 disabled:bg-indigo-300',
  secondary:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-400 disabled:bg-slate-50 disabled:text-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  outline:
    'border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-400 disabled:text-slate-400 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400 disabled:text-slate-400 dark:text-slate-200 dark:hover:bg-slate-800',
  destructive:
    'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600 disabled:bg-red-300',
};

const SIZE_CLASSES: Record<TwButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2 px-6 text-base',
};

const BASE_CLASSES =
  'inline-flex cursor-pointer items-center justify-center rounded-md font-medium ' +
  'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'disabled:pointer-events-none disabled:cursor-not-allowed';

/**
 * Styled button. Apply to a native `<button>` or anchor `<a>` so all native
 * semantics, focus handling, and `disabled` behaviour are preserved.
 *
 * @example
 * ```html
 * <button tw-button variant="primary" size="lg">Save</button>
 * <a tw-button variant="outline" href="/docs">Docs</a>
 * ```
 */
@Directive({
  selector: 'button[tw-button], a[tw-button]',
  host: {
    '[class]': 'classes()',
    '[attr.aria-disabled]': 'disabled() || null',
  },
})
export class TwButton {
  readonly variant = input<TwButtonVariant>('primary');
  readonly size = input<TwButtonSize>('md');
  /** Reflected to `aria-disabled`; bind the native `[disabled]` for real disabling. */
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    [BASE_CLASSES, VARIANT_CLASSES[this.variant()], SIZE_CLASSES[this.size()]].join(' '),
  );
}
