import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  template: `
    <div class="container-sm mt-5 d-flex">
      <div class="d-none d-sm-block col-sm-3 col-md-3 col-lg-3 col-xl-2 left-panel">
        <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px; border-radius: 10px;">
          <h1 routerLink="/account" role="button" class="text-center cursor-pointer w-100">Account</h1>
          <div class="p-3" style="height: 300px ;border-radius: 10px;">
            <div routerLink="/account" role="button" class="item cursor-pointer">User Details</div>
            <div routerLink="orders" role="button" class="item cursor-pointer">Orders</div>
            <div routerLink="password-change" role="button" class="item cursor-pointer">Password Change</div>
            <div routerLink="my-addresess" role="button" class="item cursor-pointer">My Addresess</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-9 col-md-9 col-lg-9 col-xl-10 right-panel mt-2">
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
    `,
  ],
})
export class AccountComponent {}
