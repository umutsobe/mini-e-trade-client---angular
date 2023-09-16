import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { OrderService } from 'src/app/services/models/order.service';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-success-order',
  template: `
    <div class="container-sm" style="margin-bottom: 700px;">
      <div *ngIf="isValid" style="width: 100%;" class="rounded-3 mt-5 flex-column d-flex justify-content-center">
        <fa-icon style="font-size: 100px; color: green;" class="me-1 mb-4 d-flex justify-content-center" [icon]="faCircleCheck"></fa-icon>
        <h1 class="fs-1 d-flex justify-content-center">THANK YOU FOR YOUR PURCHASE</h1>
        <p class="d-flex justify-content-center">Your order code is: {{ orderCode }}</p>
        <p class="d-flex justify-content-center">When your order is confirmed, we will send you an email.</p>
        <a routerLink="/account/orders" class="p-2 text-decoration-none d-flex justify-content-center" role="button">My Orders</a>
        <div class="d-flex justify-content-center">
          <button routerLink="/search" class="mt-1 col-7 col-md-5 col-lg-3 btn btn-success mt-2 d-flex justify-content-center">Continue shopping</button>
        </div>
      </div>
      <div class="d-flex justify-content-center mt-4" *ngIf="!isValid && !loading">
        <div class="col-6 col-md-4 col-lg-2 alert alert-danger d-flex justify-content-center">Error</div>
      </div>
    </div>
  `,
})
export class SuccessOrderComponent implements OnInit {
  isValid = false;
  orderCode: string = '';
  orderId: string = '';
  faCircleCheck = faCircleCheck;
  loading = true;

  constructor(private authService: AuthService, private orderService: OrderService, private router: ActivatedRoute) {
    this.router.params.subscribe({
      next: async (params) => {
        this.orderCode = params['orderCode'];
      },
    });
  }

  async ngOnInit() {
    await this.orderService.isOrderValid(this.orderCode).then((response) => {
      this.isValid = response.isValid;
    });

    this.loading = false;
  }
}
