import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@envs/environment';
import { IProduct, IProductForTable } from '@features/products/interfaces/IProduct';
import { IResponseApi } from '@interfaces/IResponseApi';
import { IProductService } from '@shared/interfaces/IProductServices';
import { ErrorHandlerService } from '@shared/services/error-handler.service';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiProductsService implements IProductService {
  public products = signal<IProduct[]>([]);
  private readonly _http = inject(HttpClient);
  private readonly _endPoint = `${environment.serveURI}/products`;
  private readonly errorHandler = inject(ErrorHandlerService);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor() {}

  public findAll(): Observable<IResponseApi<IProduct[]>> {
    return this._http
      .get<IResponseApi<IProduct[]>>(`${this._endPoint}`, this.httpOptions)
      .pipe(
        catchError(this.errorHandler.handleError)
      );
  }

  public findOne(id: number): Observable<IProduct> {
    return this._http.get<IProduct>(`${this._endPoint}/${id}`, this.httpOptions)
    .pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  public create(product: Partial<IProductForTable>): Observable<IResponseApi<IProduct>> {
    return this._http.post<IResponseApi<IProduct>>(`${this._endPoint}`, product, this.httpOptions)
    .pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  public update(id: number, product: Partial<IProductForTable>): Observable<IResponseApi<IProduct[]>> {
    return this._http.put<IResponseApi<IProduct[]>>(`${this._endPoint}/${id}`, product, this.httpOptions)
    .pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  public delete(): Observable<IResponseApi<IProduct[]>> {
    return this._http.delete<IResponseApi<IProduct[]>>(`${this._endPoint}`, this.httpOptions)
    .pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  public verificationId(id:number): Observable<boolean> {
    return this._http.get<boolean>(`${this._endPoint}/verification/${id}`, this.httpOptions)
    .pipe(
      catchError(this.errorHandler.handleError)
    );
  }
}
