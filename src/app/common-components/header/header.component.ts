import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { AuthService, _isAuthenticated } from 'src/app/services/common/auth/auth.service';
import { AccountService } from 'src/app/services/models/account.service';

declare var $: any;

@Component({
  selector: 'app-header',
  template: `
    <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div class="container-fluid">
        <a routerLink="" role="button" class="ms-5 navbar-brand cursor-pointer">Home</a>

        <div class="d-none d-md-block nav-link me-auto">
          <div class="me-auto "><a routerLink="admin" role="button" class="text-white nav-link cursor-pointer" *ngIf="authService.isAuthenticated && (this.authService.isAdmin() || this.authService.isModerator())">Admin Panel</a></div>
        </div>

        <div class="d-none d-lg-block mx-auto">
          <form [formGroup]="frm" (ngSubmit)="search()" class="d-flex mx-auto" style="height: 40px; padding-right: 12vw;">
            <input formControlName="keyword" class="input form-control me-2" placeholder="Ara" />
            <button [disabled]="!frm.valid" type="submit" class="btn btn-warning"><fa-icon class="fs-5 me-1" [icon]="faMagnifyingGlass"></fa-icon></button>
          </form>
        </div>

        <div class="d-flex">
          <a routerLink="register" role="button" class="text-white me-4 nav-link cursor-pointer" *ngIf="!authService.isAuthenticated"><button class="btn btn-success">Register</button></a>
          <a routerLink="login" role="button" class="text-white me-4 nav-link cursor-pointer" *ngIf="!authService.isAuthenticated"><button class="btn btn-success">Login</button></a>
        </div>

        <div *ngIf="authService.isAuthenticated" class="dropdown me-3">
          <div class="btn dropdown-toggle text-white" style="background-color: #F11A7B;" data-bs-toggle="dropdown">Account</div>

          <ul class="dropdown-menu dropstart" style="width: 70px;">
            <li *ngIf="this.name.length > 0" class="dropdown-item text-truncate">{{ this.name.length > 0 ? this.name : '' }}</li>
            <li><hr class="dropdown-divider" /></li>

            <li routerLink="account" role="button" class="dropdown-item">Hesabım</li>

            <li routerLink="account/orders" role="button" class="dropdown-item">Siparişlerim</li>
            <li routerLink="/basket" role="button" class="dropdown-item">Sepetim<fa-icon class="fs-5 ms-2" [icon]="faBasketShopping"></fa-icon></li>

            <li><hr class="dropdown-divider" /></li>
            <li *ngIf="authService.isAuthenticated && (this.authService.isAdmin() || this.authService.isModerator())" routerLink="admin" role="button" class="dropdown-item">Admin Panel</li>

            <li (click)="toggleTheme()" role="button" class="dropdown-item">{{ toggleThemeString }} <fa-icon role="button" class="fs-5 m-0 ms-2 align-content-center" [icon]="faCircleHalfStroke"></fa-icon></li>
            <li><a role="button" class="dropdown-item text-danger" (click)="signOut()">Çıkış Yap</a></li>
          </ul>
        </div>

        <div class="d-none d-lg-block">
          <div *ngIf="authService.isAuthenticated" routerLink="basket" role="button" class="d-flex align-items-center cursor-pointer ">
            <fa-icon class="fs-4 me-1" [icon]="faBasketShopping"></fa-icon>
            <a class="nav-link text-white me-3">Basket</a>
          </div>
        </div>

        <div class="d-none d-lg-block user-select-none">
          <div (click)="toggleTheme()" class="d-flex flex-column justify-content-center align-items-center">
            <fa-icon role="button" class="fs-5 m-0" [icon]="faCircleHalfStroke"></fa-icon>
            <p role="button" class="m-0" style="font-size: 10px;color: white;">Theme</p>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .input {
        box-shadow: none;
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  faBasketShopping = faBasketShopping;
  faCircleHalfStroke = faCircleHalfStroke;
  faMagnifyingGlass = faMagnifyingGlass;
  toggleThemeString: string = 'Theme';
  name: string = '';

  frm: FormGroup;
  constructor(public authService: AuthService, private router: Router, private accountService: AccountService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.authService.identityCheck();

    this.frm = this.formBuilder.group({
      keyword: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    });

    if (_isAuthenticated)
      this.accountService.getUserDetails().then((response) => {
        this.name = response.name;
      });

    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light');
      this.toggleThemeString = 'Light Theme';
    } else {
      if (localStorage.getItem('theme') == 'light') {
        $('body').attr('data-bs-theme', 'light');
      } else {
        $('body').attr('data-bs-theme', 'dark');
      }
    }
  }

  search() {
    let searchValue: string = this.keyword.value;
    const resultString: string = searchValue.replace('?', '');

    this.router.navigate(['/search'], { queryParams: { keyword: resultString } });
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

  get keyword() {
    return this.frm.get('keyword');
  }
}
// <a routerLink="">Home</a>| <a routerLink="products">Products</a>| <a routerLink="basket">Basket</a>|
