import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  TwAccordion,
  TwAccordionItem,
  TwButton,
  TwCard,
  TwDialog,
  TwTab,
  TwTabList,
  TwTabPanel,
  TwTabs,
  TwTooltip,
} from 'ngwind';
import { ConfirmDialog } from './confirm-dialog';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TwButton,
    TwCard,
    TwTooltip,
    TwTabs,
    TwTabList,
    TwTab,
    TwTabPanel,
    TwAccordion,
    TwAccordionItem,
  ],
  templateUrl: './app.html',
})
export class App {
  private readonly dialog = inject(TwDialog);

  protected readonly activeTab = signal('overview');
  protected readonly lastConfirm = signal<string>('—');

  openConfirm(): void {
    const ref = this.dialog.open<boolean>(ConfirmDialog, {
      data: {
        title: 'Delete project?',
        message: 'This permanently removes the project and all of its data. This cannot be undone.',
      },
    });
    ref.closed.subscribe((result) => {
      this.lastConfirm.set(result ? 'Confirmed ✓' : 'Cancelled ✗');
    });
  }
}
