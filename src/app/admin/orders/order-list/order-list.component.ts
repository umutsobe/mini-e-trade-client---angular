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
    <ngx-spinner size="medium" type="ball-spin-clockwise-fade">Loading...</ngx-spinner>
    <h1 class="mt-2 text-center" id="title">Orders</h1>
    <div class="mat-elevation-z8">
      <table mat-table [dataSource]="dataSource">
        <ng-container matColumnDef="orderCode">
          <th mat-header-cell *matHeaderCellDef>orderCode</th>
          <td mat-cell *matCellDef="let element">{{ element.orderCode }}</td>
        </ng-container>

        <ng-container matColumnDef="userName">
          <th mat-header-cell *matHeaderCellDef>userName</th>
          <td mat-cell *matCellDef="let element">{{ element.userName }}</td>
        </ng-container>

        <ng-container matColumnDef="totalPrice">
          <th mat-header-cell *matHeaderCellDef>totalPrice</th>
          <td mat-cell *matCellDef="let element">{{ element.totalPrice }}</td>
        </ng-container>

        <ng-container matColumnDef="createdDate">
          <th mat-header-cell *matHeaderCellDef>CreatedDate</th>
          <td mat-cell *matCellDef="let element">{{ formatDate(element.createdDate) }}</td>
        </ng-container>

        <ng-container matColumnDef="orderDetail">
          <th mat-header-cell *matHeaderCellDef>orderDetail</th>
          <td mat-cell *matCellDef="let element">
            <img type="button" data-bs-toggle="modal" data-bs-target="#orderDetailModal" (click)="openOrderDetailDialog(element)" src="/assets/orderDetail.png" width="25" style="cursor:pointer;" />
          </td>
        </ng-container>

        <ng-container matColumnDef="delete">
          <th mat-header-cell *matHeaderCellDef>Delete</th>
          <td mat-cell *matCellDef="let element">
            <img type="button" data-bs-toggle="modal" data-bs-target="#deleteModal" (click)="openDeleteDialog(element)" src="/assets/delete.png" width="25" style="cursor:pointer;" />
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <mat-paginator (page)="pageChanged()" [pageSizeOptions]="[5, 10]" showFirstLastButtons aria-label="Select page of periodic elements"> </mat-paginator>
    </div>
    <div class="d-flex justify-content-end mt-2">
      <button (click)="refresh()" id="refresh" class="btn btn-primary">Refresh</button>
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
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OrderListComponent {
  constructor(private orderService: OrderService, private spinner: NgxSpinnerService, private toastr: ToastrService) {}

  displayedColumns: string[] = ['orderCode', 'userName', 'totalPrice', 'createdDate', 'orderDetail', 'delete'];
  dataSource: MatTableDataSource<List_Order> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getOrders() {
    this.spinner.show();
    const allOrders: { totalOrderCount: number; orders: List_Order[] } = await this.orderService.read(
      this.paginator ? this.paginator.pageIndex : 0,
      this.paginator ? this.paginator.pageSize : 5,
      () => this.spinner.hide(),
      (errorMessage) => {
        this.toastr.warning(errorMessage);
        this.spinner.hide();
      }
    );
    this.dataSource = new MatTableDataSource<List_Order>(allOrders.orders);
    this.paginator.length = allOrders.totalOrderCount;
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
