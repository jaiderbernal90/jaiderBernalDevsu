import { Component, inject, Input, output } from '@angular/core';
import { GenericObject, IHeader } from '../../interfaces/ITable';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { iconInfo, iconMenu } from '@shared/utils/consts';
import { MenuDropdownComponent } from '../menu-dropdown/menu-dropdown.component';
import { PaginationService } from '@shared/services/pagination.service';
import { ProductsService } from '@features/products/services/products.service';
import { iconArrowLeft, iconArrowRight } from '../../utils/consts';
import { NgClass } from '@angular/common';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MenuDropdownComponent, ConfirmationModalComponent, NgClass],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() headers: IHeader[] = [];
  @Input() items: GenericObject[] = [];
  public readonly _paginationSvc = inject(PaginationService);
  public readonly _productsSvc = inject(ProductsService);
  onPageChange = output<boolean>();
  onChangeItemsPerPage = output<number>();
  iconInfo: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(iconInfo);
  iconArrowLeft: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(iconArrowLeft);
  iconArrowRight: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(iconArrowRight);

  constructor(private sanitizer: DomSanitizer) {}

  public toggleMenu(): void {}

  public onChangeLimit(event: Event): void {
    const inputElement = event?.target as HTMLInputElement;
    const limit = +inputElement.value;
    this._paginationSvc.setItemsPerPage(limit);
    this.onChangeItemsPerPage.emit(limit);
  }

  prevPage() {
    this._paginationSvc.setPage(this._paginationSvc.currentPage - 1);
    this.onPageChange.emit(true);
  }
  nextPage() {
    this._paginationSvc.setPage(this._paginationSvc.currentPage + 1);
    this.onPageChange.emit(true);
  }
}
