import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  constructor(private readonly _router: Router) {}

  public navigateToEditProduct(productId: number): void {
    this._router.navigate(['/productos/editar', productId]);
  }

  public navigateToHome(): void {
    this._router.navigate(['/']);
  }
}
