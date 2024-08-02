import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private showConfirmDialogSignal = signal(false);
  private confirmCallback: (() => void) | null = null;
  public readonly productToDelete  = signal<string | null>('');

  showConfirmDialog(): boolean {
    return this.showConfirmDialogSignal();
  }

  openConfirmDialog(productName: string, callback: () => void): void {
    this.productToDelete.set(productName);
    this.confirmCallback = callback;
    this.showConfirmDialogSignal.set(true);
  }

  closeConfirmDialog(): void {
    this.showConfirmDialogSignal.set(false);
    this.confirmCallback = null;
    this.productToDelete.set(null);
  }

  confirmDelete(): void {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.closeConfirmDialog();
  }
}
