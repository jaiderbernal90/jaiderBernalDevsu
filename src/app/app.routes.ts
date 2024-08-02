import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path:'',
    component: LayoutComponent,
    // canActivate: [authGuard],
    children: [
      {
        path:'productos',
        children: [
          {
            path:'',
            loadComponent: () => import('./features/products/components/list-products/list-products.component').then(c => c.ListProductsComponent),
          },
          {
            path:'crear',
            loadComponent: () => import('./features/products/components/add-product/add-product.component').then(c => c.AddProductComponent),
          },
          {
            path:'editar/:id',
            loadComponent: () => import('./features/products/components/add-product/add-product.component').then(c => c.AddProductComponent),
          }
        ]
      },
    ]
  },
  { path: '**', redirectTo: 'productos' },
];
