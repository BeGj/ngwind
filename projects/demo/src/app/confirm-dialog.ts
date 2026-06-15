import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DIALOG_DATA,
  DialogRef,
  TwButton,
  TwDialogActions,
  TwDialogContent,
  TwDialogTitle,
} from 'ngwind';

export interface ConfirmData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TwButton, TwDialogTitle, TwDialogContent, TwDialogActions],
  template: `
    <h2 tw-dialog-title>{{ data.title }}</h2>
    <div tw-dialog-content>{{ data.message }}</div>
    <div tw-dialog-actions>
      <button tw-button variant="ghost" (click)="dialogRef.close(false)">Cancel</button>
      <button tw-button variant="destructive" (click)="dialogRef.close(true)">Confirm</button>
    </div>
  `,
})
export class ConfirmDialog {
  protected readonly dialogRef = inject<DialogRef<boolean>>(DialogRef);
  protected readonly data = inject<ConfirmData>(DIALOG_DATA);
}
