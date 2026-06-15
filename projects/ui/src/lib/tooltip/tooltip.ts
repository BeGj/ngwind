import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
} from '@angular/core';

export type TwTooltipPosition = 'above' | 'below' | 'left' | 'right';

const POSITION_MAP: Record<TwTooltipPosition, ConnectedPosition> = {
  above: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
  below: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
  left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
  right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
};

/** Internal bubble rendered inside the overlay. */
@Component({
  selector: 'tw-tooltip-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="pointer-events-none max-w-xs rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-md dark:bg-slate-700"
      role="tooltip"
    >
      {{ text }}
    </div>
  `,
})
export class TwTooltipContent {
  text = '';
}

/**
 * Attaches a hover/focus tooltip to its host element using a CDK Overlay.
 *
 * @example
 * ```html
 * <button tw-button twTooltip="Saves your changes" tooltipPosition="above">Save</button>
 * ```
 */
@Directive({
  selector: '[twTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focusin)': 'show()',
    '(focusout)': 'hide()',
  },
})
export class TwTooltip implements OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly host = inject(ElementRef<HTMLElement>);
  private overlayRef?: OverlayRef;

  readonly text = input.required<string>({ alias: 'twTooltip' });
  readonly tooltipPosition = input<TwTooltipPosition>('above');

  show(): void {
    const message = this.text();
    if (!message || this.overlayRef?.hasAttached()) {
      return;
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.host)
      .withPositions([POSITION_MAP[this.tooltipPosition()]]);

    this.overlayRef ??= this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    this.overlayRef.updatePositionStrategy(positionStrategy);

    const portal = new ComponentPortal(TwTooltipContent);
    const ref = this.overlayRef.attach(portal);
    ref.instance.text = message;
    ref.changeDetectorRef.markForCheck();
  }

  hide(): void {
    this.overlayRef?.detach();
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
  }
}
