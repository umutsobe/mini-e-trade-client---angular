import { Component } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-account',
  template: `
    <!-- md ve altında responsive yani 768 ve altı -->
    <div class="p-2 ps-4 pt-4 d-block d-md-none" style="width: fit-content;" type="button" data-bs-toggle="offcanvas" data-bs-target="#accountOffCanvas"><fa-icon role="button" class="fs-2" [icon]="faBars"></fa-icon></div>

    <div class="container-sm mt-5 d-flex">
      <div class="d-none d-md-block col-md-3 col-lg-3 col-xl-2 left-panel">
        <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px; border-radius: 10px;">
          <h1 routerLink="/account" role="button" class="text-center cursor-pointer w-100">Account</h1>
          <div class="p-3" style="height: 300px ;border-radius: 10px;">
            <div routerLink="/account" role="button" class="item cursor-pointer">User Details</div>
            <div routerLink="orders" role="button" class="item cursor-pointer">Orders</div>
            <div routerLink="password-change" role="button" class="item cursor-pointer">Password Change</div>
            <div routerLink="my-addresess" role="button" class="item cursor-pointer">My Addresess</div>
            <div routerLink="product-ratings" role="button" class="item cursor-pointer">My Reviewsd</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-12 col-md-9 col-lg-9 col-xl-10 right-panel mt-2">
        <div class="d-block d-md-none">
          <div class="offcanvas offcanvas-start " data-bs-scroll="true" tabindex="-1" id="accountOffCanvas" style="width: 40%;">
            <div class="offcanvas-header justify-content-end">
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <h1 routerLink="/account" role="button" data-bs-dismiss="offcanvas" class="m-0 p-0 text-center cursor-pointer w-100">Account</h1>
              <div class="pt-4">
                <div routerLink="/account" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">User Details</div>
                <div routerLink="orders" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">Orders</div>
                <div routerLink="password-change" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">Password Change</div>
                <div routerLink="my-addresess" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">My Addresess</div>
                <div routerLink="product-ratings" data-bs-dismiss="offcanvas" role="button" class="item cursor-pointer">My Reviews</div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-1 p-md-2">
          <router-outlet></router-outlet>
        </div>
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
export class AccountComponent {
  faBars = faBars;
}
