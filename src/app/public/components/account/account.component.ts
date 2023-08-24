import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  template: `
    <div class="row mx-5" style="margin-top: 100px;">
      <div class="col-3 left-panel">
        <div class="d-flex justify-content-end">
          <div style="width: 240px;">
            <ul class="list-group">
              <li routerLink="/account" role="button" class="list-group-item cursor-pointer">User Details</li>
              <li routerLink="orders" role="button" class="list-group-item cursor-pointer">Orders</li>
              <li routerLink="password-change" role="button" class="list-group-item cursor-pointer">Password Change</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-9 right-panel" style="border-radius: 10px;">
        <div class="ms-4">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .list-group-item:hover {
        opacity: 0.8;
      }
    `,
  ],
})
export class AccountComponent {}
