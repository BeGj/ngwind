import { ComponentType } from '@angular/cdk/overlay';
import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { Directive, Injectable, TemplateRef, inject } from '@angular/core';

export { DialogRef } from '@angular/cdk/dialog';
export { DIALOG_DATA } from '@angular/cdk/dialog';

/**
 * Thin, Tailwind-styled wrapper over the CDK Dialog primitive. The CDK supplies
 * the focus trap, scroll blocking, and ARIA wiring; this service layers on a
 * styled panel and backdrop so consumers get a ready-to-use modal.
 */
@Injectable({ providedIn: 'root' })
export class TwDialog {
  private readonly cdkDialog = inject(Dialog);

  open<R = unknown, D = unknown, C = unknown>(
    component: ComponentType<C> | TemplateRef<C>,
    config?: DialogConfig<D, DialogRef<R, C>>,
  ): DialogRef<R, C> {
    return this.cdkDialog.open<R, D, C>(component, {
      hasBackdrop: true,
      backdropClass: ['bg-slate-900/50', 'backdrop-blur-sm'],
      panelClass: [
        'block',
        'w-[min(32rem,calc(100vw-2rem))]',
        'rounded-xl',
        'bg-white',
        'text-slate-900',
        'shadow-xl',
        'outline-none',
        'dark:bg-slate-900',
        'dark:text-slate-100',
      ],
      ...config,
    });
  }
}

/** Styled title region for a dialog. */
@Directive({
  selector: '[tw-dialog-title]',
  host: { class: 'block px-6 pt-6 text-lg font-semibold' },
})
export class TwDialogTitle {}

/** Scrollable body region for a dialog. */
@Directive({
  selector: '[tw-dialog-content]',
  host: {
    class:
      'block max-h-[60vh] overflow-y-auto px-6 py-4 text-sm text-slate-600 dark:text-slate-300',
  },
})
export class TwDialogContent {}

/** Footer action row for a dialog, right-aligned. */
@Directive({
  selector: '[tw-dialog-actions]',
  host: { class: 'flex items-center justify-end gap-3 px-6 pb-6 pt-2' },
})
export class TwDialogActions {}
