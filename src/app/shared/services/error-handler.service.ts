import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor () {}

  public handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del lado del cliente: ${error?.error?.message}`;
    } else {
      errorMessage = `Código de error: ${error?.status}\nMensaje: ${error?.error?.message}`;
    }
    alert(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
