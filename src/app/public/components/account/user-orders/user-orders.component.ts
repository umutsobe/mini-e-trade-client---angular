import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListUserOrders } from 'src/app/contracts/account/ListUserOrders';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { AccountService } from 'src/app/services/models/account.service';

@Component({
  selector: 'app-user-orders',
  template: `
    <div class="d-flex justify-content-center">
      <div class="col-11 col-sm-11 col-md-10 col-lg-8 col-xl-7">
        <div *ngIf="spinnerElement" class="spinner-border text-primary" role="status"></div>

        <div *ngIf="orders == null ? false : orders.length > 0" style="margin-bottom: 500px;">
          <div *ngFor="let order of orders" class="mb-4 card">
            <div class="d-flex p-3 m-0 justify-content-between card-header">
              <div>
                <h4 class="m-0 p-0">{{ orders == null ? '' : formatDate(order.createdDate) }}</h4>
                <h4 class="m-0 p-0">Toplam: {{ orders == null ? '' : (order.totalPrice | currency : '₺') }}</h4>
              </div>
              <p class="m-0 p-0">OrderCode: {{ orders == null ? '' : order.orderCode }}</p>
            </div>

            <div *ngFor="let orderItem of order.orderItems" class="my-2 py-2 card-body">
              <!-- iterasyon burada olacak -->
              <div class="py-2 d-flex">
                <img width="120px" src="/assets/product.jpg" style="border-radius: 10px;" />
                <div class="ms-2 mt-1">
                  <p class="m-0">{{ orders == null ? '' : orderItem.name }}</p>
                  <p class="m-0">Order Price: {{ orders == null ? '' : (orderItem.price | currency : '₺') }}</p>
                  <p class="m-0">Quantity: {{ orders == null ? '' : orderItem.quantity }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!(orders == null ? false : orders.length > 0) && !spinnerElement" class="alert alert-info" role="alert">You don't have any orders.</div>
      </div>
    </div>
  `,
})
export class UserOrdersComponent implements OnInit {
  constructor(private accountService: AccountService, private authService: AuthService) {}
  orders: ListUserOrders[];

  spinnerElement = true;

  async ngOnInit() {
    this.orders = await this.accountService.listUserOrders(this.authService.UserId);
    this.spinnerElement = false;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }
}
