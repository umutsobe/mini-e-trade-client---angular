import { Component } from '@angular/core';
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  template: `
    <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div class="container-fluid">
        <a routerLink="" role="button" class="ms-5 navbar-brand cursor-pointer">Home</a>
        <a routerLink="products" role="button" class="text-white me-4 nav-link cursor-pointer">Products</a>
        <a routerLink="admin" role="button" class="text-white nav-link me-auto cursor-pointer">Admin Panel</a>
        <form class="d-flex me-5 me-auto" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" />
          <button class="btn btn-warning" style="background-color: #f3a847;" type="button"><p style="margin-top: 1px; margin-bottom: 0;">Search</p></button>
        </form>
        <a routerLink="register" role="button" class="text-white me-4 nav-link cursor-pointer"><button class="btn btn-success">Register</button></a>
        <div routerLink="basket" role="button" class="d-flex align-items-center cursor-pointer">
          <fa-icon class="fs-4 me-1" [icon]="faBasketShopping"></fa-icon>
          <a class="nav-link text-white me-5">Basket</a>
        </div>
      </div>
    </nav>
  `,
})
export class HeaderComponent {
  faBasketShopping = faBasketShopping;
}
// <a routerLink="">Home</a>| <a routerLink="products">Products</a>| <a routerLink="basket">Basket</a>|
