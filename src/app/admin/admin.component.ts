import { Component } from '@angular/core';
import { AuthService } from '../services/common/auth/auth.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-layout',
  template: `
    <!-- lg ve altında responsive 992 ve altı -->
    <div class="p-2 ps-3 pt-3 d-lg-none d-md-block" style="width: fit-content;" type="button" data-bs-toggle="offcanvas" data-bs-target="#adminPanelOffCanvas"><fa-icon role="button" class="fs-2" [icon]="faBars"></fa-icon></div>

    <div class="row mx-1 mt-5">
      <div class="d-none d-lg-block col-lg-3 col-xl-2 left-panel">
        <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px; border-radius: 10px;">
          <h1 routerLink="/admin" role="button" class="text-center cursor-pointer w-100">Admin Panel</h1>
          <div class="p-3" style="height: 500px ;border-radius: 10px;">
            <div routerLink="/admin" role="button" class="item cursor-pointer">Dashboard</div>
            <div routerLink="list-product" role="button" class="item cursor-pointer">Products</div>
            <div routerLink="create-product" role="button" class="item cursor-pointer">Create Product</div>
            <div routerLink="categories" role="button" class="item cursor-pointer">Categories</div>
            <div routerLink="orders" role="button" class="item cursor-pointer">Orders</div>
            <div *ngIf="this.authService.isAdmin()" routerLink="authorize-menu" role="button" class="item cursor-pointer">Endpoint-Role Menu</div>
            <div *ngIf="this.authService.isAdmin()" routerLink="roles" role="button" class="item cursor-pointer">Roles</div>
            <div *ngIf="this.authService.isAdmin()" routerLink="users" role="button" class="item cursor-pointer">Users</div>
          </div>
        </div>
      </div>
      <div class="d-md-block col-lg-9 col-xl-10 right-panel mt-2" style="border-radius: 10px;">
        <div class="d-lg-none d-md-block">
          <div class="offcanvas offcanvas-start " data-bs-scroll="true" tabindex="-1" id="adminPanelOffCanvas" style="width: 40%;">
            <div class="offcanvas-header justify-content-end">
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <h1 routerLink="/admin" role="button" data-bs-dismiss="offcanvas" class="text-center cursor-pointer w-100">Admin Panel</h1>
              <div class="pt-3">
                <div routerLink="/admin" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">Dashboard</div>
                <div routerLink="list-product" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">Products</div>
                <div routerLink="create-product" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">Create Product</div>
                <div routerLink="categories" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">Categories</div>
                <div routerLink="orders" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">Orders</div>
                <div *ngIf="this.authService.isAdmin()" routerLink="authorize-menu" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">Endpoint-Role Menu</div>
                <div *ngIf="this.authService.isAdmin()" routerLink="roles" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">Roles</div>
                <div *ngIf="this.authService.isAdmin()" routerLink="users" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">Users</div>
              </div>
            </div>
          </div>
        </div>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      .item {
        padding: 10px 3px 10px 5px;
      }
      .item:hover {
        border-right: 1px solid gray;
        opacity: 0.8;
      }
      *:focus {
        box-shadow: none !important;
      }
    `,
  ],
})
export class AdminComponent {
  faBars = faBars;
  constructor(public authService: AuthService) {}
}
