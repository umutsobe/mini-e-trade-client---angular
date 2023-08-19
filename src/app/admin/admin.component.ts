import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <h1 routerLink="/admin" role="button" class="mt-3 ms-5 mb-4 cursor-pointer" style="width: fit-content;">Admin Panel</h1>
    <div class="row mx-5">
      <div class="col-2 left-panel">
        <ul class="list-group">
          <li routerLink="/admin" role="button" class="list-group-item cursor-pointer">Dashboard</li>
          <!-- <li routerLink="customers" role="button" class="list-group-item cursor-pointer">Customers</li> -->
          <li routerLink="products" role="button" class="list-group-item cursor-pointer" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Products</li>
          <li routerLink="orders" role="button" class="list-group-item cursor-pointer">Orders</li>
          <li routerLink="authorize-menu" role="button" class="list-group-item cursor-pointer">Authorize Menu</li>
          <li routerLink="roles" role="button" class="list-group-item cursor-pointer">Roles</li>
        </ul>
      </div>
      <div class="col-10 right-panel" style="height: 1000px; border-radius: 10px;">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AdminComponent {}
