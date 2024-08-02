import { Injectable } from '@angular/core';
import { IProduct, IProductForTable } from '../interfaces/IProduct';
import { DatePipe } from '@angular/common';
import { SharedService } from '@shared/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class DataTransformationService {
  private readonly datePipe = new DatePipe('en-US');

  constructor(private readonly _sharedSvc: SharedService) {}

  public transformProductsToTableData(data: IProductForTable[]): IProductForTable[] {
    return data.map((product) => ({
      ...product,
      logo: product.logo
        ? `<img src="${product.logo}" alt="Logo">`
        : this._sharedSvc.getInitials(product?.name || ''),
      date_release: this.datePipe.transform(product.date_release, 'dd/MM/YYYY'),
      date_revision: this.datePipe.transform(
        product.date_revision,
        'dd/MM/YYYY'
      ),
    }));
  }
}
