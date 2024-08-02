import { IProduct } from "@features/products/interfaces/IProduct";
import { Observable } from "rxjs";
import { IResponseApi } from "./IResponseApi";
import { signal, WritableSignal } from '@angular/core';

export interface IProductService{
  products: WritableSignal<IProduct[]>;
  findAll(): Observable<IResponseApi<IProduct[]>> ;
  findOne(id: number): Observable<IProduct>;
  update(id: number, product: IProduct): Observable<IResponseApi<IProduct[]>>;
  delete(): Observable<IResponseApi<IProduct[]>>;
  verificationId(id:number): Observable<boolean>;
}
