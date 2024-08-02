import { Component, inject, OnInit } from '@angular/core';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService } from '@features/products/services/products.service';
import { FilterProductsPipe } from '@features/products/pipes/filter-products.pipe';
import { PaginationService } from '@shared/services/pagination.service';
import { IProductForTable } from '@features/products/interfaces/IProduct';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [
    SearchComponent,
    CardComponent,
    TableComponent,
    RouterLink,
    FilterProductsPipe,
  ],
  providers: [DatePipe],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss',
})
export class ListProductsComponent implements OnInit {
  public readonly _productsSvc = inject(ProductsService);
  public readonly _paginationSvc = inject(PaginationService);
  public paginatedProducts: IProductForTable[] = [];

  constructor() {}

  ngOnInit(): void {
    this.getProducts();
  }

  public getProducts(): void {
    this._productsSvc
      .findAll()
      .subscribe((res) => this.updatePaginatedProducts());
  }

  public updatePaginatedProducts(): void {
    this.paginatedProducts = this._paginationSvc.getPaginatedData(
      this._productsSvc.products()
    );
  }

  onSearchChange(term: string = ''): void {
    this._productsSvc.termSearch.set(term);
    !term
      ? this._paginationSvc.setItemsPerPage(5)
      : this._paginationSvc.setItemsPerPage(
          this._productsSvc.products().length
        );

    this.updatePaginatedProducts();
  }
}
