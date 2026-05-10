import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/home/home').then(m => m.HomeComponent)
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./components/home/home').then(m => m.HomeComponent)
      },
      {
        path: 'category',
        loadChildren: () =>
          import('../category/category-module').then(m => m.CategoryModule)
      },
      {
        path: 'product',
        loadChildren: () =>
          import('../product/product-module').then(m => m.ProductModule)
      }
    ]
  }
];
