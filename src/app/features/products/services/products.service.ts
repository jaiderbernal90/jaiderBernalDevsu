import { inject, Injectable, signal } from '@angular/core';
import { ApiProductsService } from '@api/products.service';
import { finalize, map, Observable, tap } from 'rxjs';
import { IResponseApi } from '@interfaces/IResponseApi';
import { IProduct, IProductForTable } from '../interfaces/IProduct';
import { SharedService } from '@shared/services/shared.service';
import { LoaderService } from '@shared/services/loader.service';
import { DataTransformationService } from './data-transformation.service';
import { RouteService } from './route.service';
import { IHeader } from '@shared/interfaces/ITable';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly _productsAPI = inject(ApiProductsService);
  private readonly _loaderSvc = inject(LoaderService);
  private readonly _dataTransformationSvc = inject(DataTransformationService);
  private readonly _routeSvc = inject(RouteService);
  public products = signal<IProductForTable[]>([]);
  public idValid = signal<boolean>(false);
  public product = signal<IProduct | undefined>(undefined);
  public idProduct = signal<number | undefined>(undefined);
  public termSearch = signal<string>('');

  public actions = [
    {
      name: 'Editar',
      callback: (index: number) => this.editItem(index),
    },
    {
      name: 'Eliminar',
      callback: (index: number) => this.deleteItem(index),
    },
  ];

  public headers: IHeader[] = [
    {
      key: 'logo',
      value: 'Logo',
      iconInformation: false,
      class: 'text-center',
      type: 'image',
    },
    { key: 'name', value: 'Nombre del producto', iconInformation: false },
    { key: 'description', value: 'Descripción', iconInformation: true },
    {
      key: 'date_release',
      value: 'Fecha de liberación',
      iconInformation: true,
    },
    {
      key: 'date_revision',
      value: 'Fecha de reestructuración',
      iconInformation: true,
    },
    {
      key: 'actions',
      value: '',
      iconInformation: false,
      class: 'content__actions',
      actions: this.actions,
    },
  ];

  public findAll(): Observable<IResponseApi<IProduct[]>> {
    return this._productsAPI.findAll().pipe(
      tap({
        next: (res: IResponseApi<IProduct[]>) =>
          this.products.set(this._dataTransformationSvc.transformProductsToTableData(res?.data || [])),
        error: (error) => console.error('Error fetching products:', error),
      })
    );
  }

  public findOne(id: number): Observable<IProduct> {
    return this._productsAPI.findOne(id).pipe(
      tap({
        next: (product: IProduct) => this.product.set(product),
        error: (error) => console.error('Error fetching product:', error),
      })
    );
  }

  public create(
    product: Partial<IProductForTable>
  ): Observable<IResponseApi<IProductForTable>> {
    this._loaderSvc.show();
    return this._productsAPI.create(product).pipe(
      finalize(() => this._loaderSvc.hide()),
      tap({
        next: (res: IResponseApi<IProduct>) => {
          this.idProduct.set(undefined);
          this._routeSvc.navigateToHome();
          alert(res.message);
        },
        error: (error) => console.error('Error creating product:', error),
      })
    );
  }

  public update(
    id: number,
    product: Partial<IProductForTable>
  ): Observable<IResponseApi<IProduct[]>> {
    this._loaderSvc.show();
    return this._productsAPI.update(id, product).pipe(
      finalize(() => this._loaderSvc.hide()),
      tap({
        next: (res: IResponseApi<IProduct[]>) => {
          this.idProduct.set(undefined);
          this._routeSvc.navigateToHome();
          alert(res.message);
        },
        error: (error) => console.error('Error updating product:', error),
      })
    );
  }

  public delete(): Observable<IResponseApi<IProduct[]>> {
    return this._productsAPI.delete().pipe(
      tap({
        next: (res: IResponseApi<IProduct[]>) =>
          this.products.set(res?.data || []),
        error: (error) => console.error('Error deleting product:', error),
      })
    );
  }

  public verificationId(id: number): Observable<boolean> {
    return this._productsAPI.verificationId(id).pipe(
      tap({
        next: (isValid: boolean) => this.idValid.set(isValid),
        error: (error) => console.error('Error verifying ID:', error),
      }),
      map((response) => response)
    );
  }

  public getIdProduct(indexProduct: number): number | null | undefined {
    return this.products().filter((product, index) => index === indexProduct)[0]
      .id;
  }

  public editItem(index: number): void {
    console.log('editItem desde service', index);
    const productId = this.getIdProduct(index);
    if (productId !== undefined && productId !== null) {
      this._routeSvc.navigateToEditProduct(productId);
    }
  }

  public deleteItem(index?: number): void {
    console.log('deleteItem desde service');
  }
}
