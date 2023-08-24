import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListUserOrders } from 'src/app/contracts/account/ListUserOrders';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { AccountService } from 'src/app/services/models/account.service';

@Component({
  selector: 'app-user-orders',
  template: `
    <div *ngIf="orders == null ? false : orders.length > 0" style="margin-bottom: 500px;">
      <div *ngFor="let order of orders" class="mb-4" style="border: 1px solid #85E6C5; border-radius: 10px;">
        <div class="d-flex p-3 m-0 justify-content-between" style="border-bottom: 1px solid #85E6C5;">
          <div>
            <h4 class="m-0">{{ orders == null ? '' : order.createdDate }}</h4>
            <h4 class="m-0">Toplam: {{ orders == null ? '' : (order.totalPrice | currency : '₺') }}</h4>
          </div>
          <h4>OrderCode: {{ orders == null ? '' : order.orderCode }}</h4>
        </div>

        <div *ngFor="let orderItem of order.orderItems" class="my-2 py-2">
          <!-- iterasyon burada olacak -->
          <div class="py-2 ms-5 d-flex">
            <img width="120px" src="/assets/product.jpg" style="border-radius: 10px;" />
            <div class="ms-3 mt-1">
              <p class="m-0">{{ orders == null ? '' : orderItem.name }}</p>
              <p class="m-0">Sipariş Fiyatı: {{ orders == null ? '' : (orderItem.price | currency : '₺') }}</p>
              <p class="m-0">Adet: {{ orders == null ? '' : orderItem.quantity }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!(orders == null ? false : orders.length > 0)" class="alert alert-info" role="alert">Herhangi bir siparişiniz yok</div>
  `,
})
export class UserOrdersComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService, private accountService: AccountService, private authService: AuthService) {}

  orders: ListUserOrders[];

  async ngOnInit() {
    this.orders = await this.accountService.listUserOrders(this.authService.UserId);
  }
}
