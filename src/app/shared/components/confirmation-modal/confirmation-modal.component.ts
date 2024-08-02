import { Component, input, Input, output } from '@angular/core';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationModalComponent {
  productName = input<string>();
  confirm = output<boolean>();

  constructor(public _modalSvc: ModalService) {}

  onCancel(): void {
    this._modalSvc.closeConfirmDialog();
  }

  onConfirm(): void {
    this._modalSvc.confirmDelete();
  }
}
