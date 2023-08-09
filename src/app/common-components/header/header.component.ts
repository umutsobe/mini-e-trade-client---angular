import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/common/auth/auth.service';

declare var $: any;

@Component({
  selector: 'app-header',
  template: `
    <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div class="container-fluid">
        <a routerLink="" role="button" class="ms-5 navbar-brand cursor-pointer">Home</a>
        <a routerLink="products/1" role="button" class="text-white me-4 nav-link cursor-pointer">Products</a>
        <div class="me-auto "><a routerLink="admin" role="button" class="text-white nav-link cursor-pointer" *ngIf="authService.isAuthenticated">Admin Panel</a></div>
        <form class="d-flex me-5 me-auto" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" />
          <button class="btn btn-warning" style="background-color: #f3a847;" type="button"><p style="margin-top: 1px; margin-bottom: 0;">Search</p></button>
        </form>
        <div class="d-flex">
          <a routerLink="register" role="button" class="text-white me-4 nav-link cursor-pointer" *ngIf="!authService.isAuthenticated"><button class="btn btn-success">Register</button></a>
          <a routerLink="login" role="button" class="text-white me-4 nav-link cursor-pointer" *ngIf="!authService.isAuthenticated"><button class="btn btn-success">Login</button></a>
          <a role="button" class="text-white me-4 nav-link cursor-pointer" (click)="signOut()" *ngIf="authService.isAuthenticated"><button class="btn btn-success">Çıkış Yap</button></a>
        </div>
        <div *ngIf="authService.isAuthenticated" routerLink="basket" role="button" class="d-flex align-items-center cursor-pointer">
          <fa-icon class="fs-4 me-1" [icon]="faBasketShopping"></fa-icon>
          <a class="nav-link text-white me-5">Basket</a>
        </div>
        <button (click)="toggleTheme()" class="btn btn-success btn-sm">{{ toggleThemeString }}</button>
      </div>
    </nav>
  `,
})
export class HeaderComponent implements OnInit {
  faBasketShopping = faBasketShopping;
  toggleThemeString: string;

  constructor(public authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.identityCheck();
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light');
    } else {
      if (localStorage.getItem('theme') == 'light') {
        $('body').attr('data-bs-theme', 'light');
        this.toggleThemeString = 'Dark Theme';
      } else {
        $('body').attr('data-bs-theme', 'dark');
        this.toggleThemeString = 'Light Theme';
      }
    }
  }

  signOut() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }
  toggleTheme() {
    if (localStorage.getItem('theme') == 'dark') {
      $('body').attr('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');

      this.toggleThemeString = 'Dark Theme';
    } else {
      $('body').attr('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');

      this.toggleThemeString = 'Light Theme';
    }
  }
}
// <a routerLink="">Home</a>| <a routerLink="products">Products</a>| <a routerLink="basket">Basket</a>|
