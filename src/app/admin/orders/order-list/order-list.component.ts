import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { List_Order } from 'src/app/contracts/order/list-order';
import { OrderService } from 'src/app/services/models/order.service';
import { SingleOrder } from 'src/app/contracts/order/single_order';

@Component({
  selector: 'app-order-list',
  template: `
    <h1 class="mb-5 text-center" id="title">Orders</h1>
    <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px;">
      <table class="table table-striped table-responsive">
        <thead>
          <tr class="text-center">
            <th scope="col">orderCode</th>
            <th scope="col">userName</th>
            <th scope="col">totalPrice</th>
            <th scope="col">Created Date</th>
            <th scope="col">completed</th>
            <th scope="col">orderDetail</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody *ngIf="this.allOrders">
          <tr *ngFor="let order of this.allOrders.orders" class="text-center">
            <td>{{ order.orderCode }}</td>
            <td>{{ order.userName }}</td>
            <td>{{ order.totalPrice }}</td>
            <td>{{ formatDate(order.createdDate.toString()) }}</td>
            <td>
              <img *ngIf="order.completed" type="button" src="/assets/completed.png" width="25" style="cursor:pointer;" />
            </td>
            <td>
              <img type="button" data-bs-toggle="modal" data-bs-target="#orderDetailModal" (click)="openOrderDetailDialog(order)" src="/assets/orderDetail.png" width="25" style="cursor:pointer;" />
            </td>
            <td>
              <img type="button" data-bs-toggle="modal" data-bs-target="#deleteModal" (click)="openDeleteDialog(order)" src="/assets/delete.png" width="25" style="cursor:pointer;" />
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-4 pagination d-flex justify-content-center">
        <div style="margin: 6px 8px 0 0;">{{ currentPageNo + 1 + '-' + totalPageCount }}</div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="first()"><<</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="prev()"><</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="next()">></a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="last()">>></a></div>
      </div>
    </div>
    <!-- delete dialog -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Ürün Silme İşlemi</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-danger">Ürün silme işlemi geri alınamaz!!!</p>
            <!-- null hatası almamak için kontrol -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <!-- <button (click)="delete()" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button> -->
          </div>
        </div>
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

            <div class="d-flex justify-content-end" style="margin-right: 90px;">Total: {{ selectedOrder.totalPrice | currency : '₺' }}</div>
            <div class="mb-3">CreatedDate: {{ formatDate(selectedSingleOrder.createdDate.toString()) }}</div>
            <div class="mb-3">Username: {{ selectedOrder.userName }}</div>
            <div class="mb-3">Adress: {{ selectedSingleOrder.address }}</div>
            <div>Description: {{ selectedSingleOrder.description }}</div>
          </div>
          <h2 style="color: green;" class="ms-3 mt-2 mb-2 d-flex justify-content-center" *ngIf="selectedOrder ? selectedOrder.completed : false">Order Completed</h2>
          <div class="modal-footer">
            <button *ngIf="selectedOrder ? !selectedOrder.completed : false" (click)="completeOrder()" type="button" class="btn btn-primary">Complete Order</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 500px;"></div>
  `,
})
export class OrderListComponent {
  constructor(private orderService: OrderService, private spinner: NgxSpinnerService, private toastr: ToastrService) {}

  allOrders: { totalOrderCount: number; orders: List_Order[] };
  currentPageNo: number = 0;
  totalOrderCount: number;
  totalPageCount: number;
  pageSize: number = 8;

  async getOrders() {
    this.spinner.show();
    const allOrders: { totalOrderCount: number; orders: List_Order[] } = await this.orderService.read(
      this.currentPageNo,
      this.pageSize,
      () => this.spinner.hide(),
      (errorMessage) => {
        this.toastr.warning(errorMessage);
        this.spinner.hide();
      }
    );

    this.allOrders = allOrders;
    this.totalOrderCount = allOrders.totalOrderCount;
    this.totalPageCount = Math.ceil(this.totalOrderCount / this.pageSize);
  }
  prev() {
    if (this.currentPageNo > 0) {
      this.currentPageNo--;
      this.getOrders();
    }
  }
  next() {
    if (this.currentPageNo != this.totalPageCount - 1) {
      this.currentPageNo++;
      this.getOrders();
    }
  }
  first() {
    this.currentPageNo = 0;
    this.getOrders();
  }
  last() {
    this.currentPageNo = this.totalPageCount - 1;
    this.getOrders();
  }
  selectedOrder: List_Order;
  selectedSingleOrder: SingleOrder;

  openDeleteDialog(element: List_Order) {
    this.selectedOrder = element;
  }
  async openOrderDetailDialog(element: List_Order) {
    this.selectedOrder = element;
    this.selectedSingleOrder = await this.orderService.getOrderById(
      element.id,
      () => {
        // success
      },
      (err) => {
        //error
      }
    );
  }
  async completeOrder() {
    this.spinner.show();

    this.orderService
      .completeOrder(this.selectedOrder.id)
      .then(() => {
        this.toastr.success('Sipariş Başarıyla Onaylandı', 'Başarılı');
        this.refresh();
      })
      .catch((err) => {
        this.toastr.error(err, 'Hata');
      })
      .finally(() => {
        this.spinner.hide();
      });
  }
  // delete() {
  //   this.spinner.show();
  //   this.orderService.delete(this.selectedOrder.id).subscribe(() => {
  //     this.spinner.hide();
  //     this.toastr.success('Ürün Başarıyla Silindi');
  //     this.getOrders();
  //   });
  // }

  formatDate(dateString: string): string {
    // date daha güzel görünür
    const date = new Date(dateString);
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
  }

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
