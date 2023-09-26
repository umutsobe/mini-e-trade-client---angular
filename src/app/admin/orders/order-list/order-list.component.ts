import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { List_Order } from 'src/app/contracts/order/list-order';
import { OrderService } from 'src/app/services/models/order.service';
import { SingleOrder } from 'src/app/contracts/order/single_order';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-order-list',
  template: `
    <h1 class="mb-5 text-center" id="title">Orders</h1>
    <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px;">
      <div class="d-flex mb-2 align-items-center">
        <div class="d-flex align-items-center justify-content-center">
          <div class="dropdown me-1" style="width: fit-content;">
            <div class="dropdown-toggle user-select-none border" type="button" data-bs-toggle="dropdown" style="padding: 8px;border-radius: 5px; ">Sort By</div>
            <ul class="dropdown-menu dropstart">
              <li (click)="sortNew()" type="button" class="dropdown-item">New Orders</li>
              <li (click)="sortOld()" type="button" class="dropdown-item">Old Orders</li>
              <li (click)="sortPriceAsc()" type="button" class="dropdown-item">Min Price</li>
              <li (click)="sortPriceDesc()" type="button" class="dropdown-item">Max Price</li>
            </ul>
          </div>

          <select role="button" class="mt-1 mt-sm-1 mt-sm-1 mt-md-0 form-select" (change)="confirmOptionSelected($event)" style="width: 120px; font-size: 15px; margin-right: 5px;">
            <option selected>All Orders</option>
            <option>Confirmed</option>
            <option>Not Confirmed</option>
          </select>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-striped">
          <thead style="border-top: 1px solid gray;">
            <tr class="text-center">
              <th scope="col" class="d-flex justify-content-center">
                <div><input type="number" [(ngModel)]="orderFilter.orderCodeKeyword" (input)="onOrderCodeInputKeyup()" style=";height: 40px; font-size: 14px;" name="onemsiz" class="form-control text-center" placeholder="Order Code Search" /></div>
              </th>
              <th scope="col" class="text-center">
                <div>
                  <input [(ngModel)]="orderFilter.usernameKeyword" (input)="onUsernameInputKeyup()" style="height: 40px;font-size: 14px;" name="onemsiz" class="form-control text-center" placeholder="Username Search" />
                </div>
              </th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <thead>
            <tr class="text-center">
              <th scope="col">OrderCode</th>
              <th scope="col">Username</th>
              <th scope="col">Total Price</th>
              <th scope="col">Created Date</th>
              <th scope="col">Is Confirmed</th>
              <th scope="col">Order Detail</th>
            </tr>
          </thead>
          <tbody *ngIf="this.allOrders">
            <tr *ngFor="let order of this.allOrders.orders" class="text-center">
              <td>{{ order.orderCode }}</td>
              <td>{{ order.username }}</td>
              <td>{{ order.totalPrice }}</td>
              <td>{{ formatDate(order.createdDate.toString()) }}</td>
              <td>
                <img *ngIf="order.completed" type="button" src="/assets/completed.png" width="25" style="cursor:pointer;" />
              </td>
              <td>
                <img type="button" data-bs-toggle="modal" data-bs-target="#orderDetailModal" (click)="openOrderDetailDialog(order)" src="/assets/orderDetail.png" width="25" style="cursor:pointer;" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="allOrders.orders.length > 0" class="mt-4 pagination d-flex justify-content-center user-select-none">
        <div style="margin: 6px 8px 0 0;">{{ orderFilter.page + 1 + '-' + totalPageCount }}</div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="first()"><<</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="prev()"><</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="next()">></a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="last()">>></a></div>
      </div>
    </div>

    <!-- order detail dialog -->
    <div class="modal fade" id="orderDetailModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Order Code: {{ selectedOrder ? selectedOrder.orderCode : '' }}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div *ngIf="selectedSingleOrder" class="modal-body">
            <div class="row my-2 py-2 text-center">
              <div class="col-5">Name</div>
              <div class="col-2">Price</div>
              <div class="col-2">Quantity</div>
              <div class="col-3">Total Price</div>
            </div>
            <div *ngFor="let orderItem of selectedSingleOrder.orderItems" class="row my-2 py-2 text-center" style="border-top: 1px solid gray;">
              <div class="col-5">{{ orderItem.name }}</div>
              <div class="col-2">{{ orderItem.price }}</div>
              <div class="col-2">{{ orderItem.quantity }}</div>
              <div class="col-3">{{ orderItem.price * orderItem.quantity | currency : '₺' }}</div>
            </div>

            <div class="mt-5 mb-3">Total Order Price: {{ selectedOrder.totalPrice | currency : '₺' }}</div>
            <div class="mb-3">CreatedDate: {{ formatDate(selectedSingleOrder.createdDate.toString()) }}</div>
            <div class="mb-3">Username: {{ selectedOrder.username }}</div>
            <div class="mb-3">Adress: {{ selectedSingleOrder.address }}</div>
            <div>Description: {{ selectedSingleOrder.description }}</div>
          </div>
          <h2 style="color: green;" class="ms-3 mt-2 mb-2 d-flex justify-content-center" *ngIf="selectedOrder ? selectedOrder.completed : false">Order Confirmed</h2>
          <div class="modal-footer">
            <button *ngIf="selectedOrder ? !selectedOrder.completed : false" (click)="confirmOrder()" type="button" class="btn btn-primary">Confirm Order</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 500px;"></div>
  `,
  styles: [
    `
      *:focus {
        box-shadow: none !important;
      }
      /* number inputlardan arrow kaldırma */
      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    `,
  ],
})
export class OrderListComponent {
  constructor(private orderService: OrderService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    this.orderCodeInputChangeSubject.pipe(debounceTime(this.searchInputDelayTime)).subscribe(() => {
      this.onSearchInputChange();
    });

    this.usernameInputChangeSubject.pipe(debounceTime(this.searchInputDelayTime)).subscribe(() => {
      this.onSearchInputChange();
    });
  }
  searchInputDelayTime = 300;

  allOrders: { totalOrderCount: number; orders: List_Order[] } = {
    orders: [],
    totalOrderCount: 0,
  };
  totalOrderCount: number;
  totalPageCount: number;

  async getOrders() {
    this.spinner.show();
    const allOrders: { totalOrderCount: number; orders: List_Order[] } = await this.orderService.getAllOrdersByFilter(this.queryStringBuilder()).finally(() => this.spinner.hide());

    this.allOrders = allOrders;
    this.totalOrderCount = allOrders.totalOrderCount;
    this.totalPageCount = Math.ceil(this.totalOrderCount / this.orderFilter.size);
  }
  prev() {
    if (this.orderFilter.page > 0) {
      this.orderFilter.page--;
      this.getOrders();
    }
  }
  next() {
    if (this.orderFilter.page != this.totalPageCount - 1) {
      this.orderFilter.page++;
      this.getOrders();
    }
  }
  first() {
    if (this.orderFilter.page != 0) {
      this.orderFilter.page = 0;
      this.getOrders();
    }
  }
  last() {
    if (this.orderFilter.page != this.totalPageCount - 1) {
      this.orderFilter.page = this.totalPageCount - 1;
      this.getOrders();
    }
  }
  selectedOrder: List_Order;
  selectedSingleOrder: SingleOrder;

  async openOrderDetailDialog(element: List_Order) {
    this.selectedOrder = element;
    this.selectedSingleOrder = await this.orderService.getOrderById(element.id);
  }
  async confirmOrder() {
    this.spinner.show();

    this.orderService
      .completeOrder(this.selectedOrder.id)
      .then(() => {
        this.toastr.success('Success');
        this.refresh();
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  formatDate(dateString: string): string {
    // date daha güzel görünür
    const date = new Date(dateString);
    return formatDate(date, 'YYYY-MM-dd HH:mm', 'en-US');
  }

  orderFilter: OrderFilter = {
    orderCodeKeyword: '',
    usernameKeyword: '',
    page: 0,
    size: 8,
    isConfirmed: undefined,
  };
  queryStringBuilder(): string {
    let queryString = 'size=8';

    if (this.orderFilter.page) queryString += `&page=${this.orderFilter.page}`;

    if (this.orderFilter.usernameKeyword) queryString += `&usernameKeyword=${this.orderFilter.usernameKeyword}`;

    if (this.orderFilter.orderCodeKeyword) queryString += `&orderCodeKeyword=${this.orderFilter.orderCodeKeyword}`;

    if (this.orderFilter.isConfirmed == true) queryString += '&isConfirmed=true';

    if (this.orderFilter.isConfirmed == false) queryString += '&isConfirmed=false';

    if (this.orderFilter.sort) queryString += `&sort=${this.orderFilter.sort}`;

    return queryString;
  }

  sortNew() {
    this.orderFilter.sort = 'new';
    this.orderFilter.page = 0;
    this.getOrders();
  }
  sortOld() {
    this.orderFilter.sort = 'old';
    this.orderFilter.page = 0;
    this.getOrders();
  }
  sortPriceAsc() {
    this.orderFilter.sort = 'priceAsc';
    this.orderFilter.page = 0;
    this.getOrders();
  }
  sortPriceDesc() {
    this.orderFilter.sort = 'priceDesc';
    this.orderFilter.page = 0;
    this.getOrders();
  }
  private orderCodeInputChangeSubject = new Subject<string>();
  private usernameInputChangeSubject = new Subject<string>();

  onOrderCodeInputKeyup() {
    this.orderCodeInputChangeSubject.next(this.orderFilter.orderCodeKeyword);
  }

  onUsernameInputKeyup() {
    this.usernameInputChangeSubject.next(this.orderFilter.usernameKeyword);
  }

  onSearchInputChange() {
    this.getOrders();
  }

  confirmOptionSelected(event) {
    if (event.target.value == 'All Orders') {
      this.orderFilter.isConfirmed = undefined;
    } else if (event.target.value == 'Confirmed') {
      this.orderFilter.isConfirmed = true;
    } else if (event.target.value == 'Not Confirmed') {
      this.orderFilter.isConfirmed = false;
    }

    this.getOrders();
  }
  // <option selected>All Orders</option>
  // <option>Confirmed</option>
  // <option>Not Confirmed</option>
  async ngOnInit() {
    await this.getOrders();
  }
  async pageChanged() {
    await this.getOrders();
  }
  async refresh() {
    await this.getOrders();
  }
}

export class OrderFilter {
  page?: number;
  size?: number;
  orderCodeKeyword?: string;
  usernameKeyword?: string;
  isConfirmed?: boolean;
  sort?: string;
}
