import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { List_Product } from 'src/app/contracts/list_product';
import { ProductService } from 'src/app/services/models/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-list',
  template: `
    <ngx-spinner size="medium" type="ball-spin-clockwise-fade">Loading...</ngx-spinner>
    <h1 class="mt-2 text-center" id="title">Products</h1>
    <div class="mat-elevation-z8">
      <table mat-table [dataSource]="dataSource">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let element">{{ element.name }}</td>
        </ng-container>

        <ng-container matColumnDef="stock">
          <th mat-header-cell *matHeaderCellDef>Stock</th>
          <td mat-cell *matCellDef="let element">{{ element.stock }}</td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Weight</th>
          <td mat-cell *matCellDef="let element">{{ element.price }}</td>
        </ng-container>

        <ng-container matColumnDef="createdDate">
          <th mat-header-cell *matHeaderCellDef>CreatedDate</th>
          <td mat-cell *matCellDef="let element">{{ formatDate(element.createdDate) }}</td>
        </ng-container>

        <ng-container matColumnDef="updatedDate">
          <th mat-header-cell *matHeaderCellDef>UpdatedDate</th>
          <td mat-cell *matCellDef="let element">{{ formatDate(element.updatedDate) }}</td>
        </ng-container>

        <ng-container matColumnDef="delete">
          <th mat-header-cell *matHeaderCellDef>Delete</th>
          <td mat-cell *matCellDef="let element">
            <img (click)="delete(element.id)" src="/assets/delete.png" width="25" style="cursor:pointer;" />
            <!-- dialog modal -->
          </td>
        </ng-container>

        <ng-container matColumnDef="edit">
          <th mat-header-cell *matHeaderCellDef>Edit</th>
          <td mat-cell *matCellDef="let element">
            <img src="/assets/edit.png" width="25" style="cursor:pointer;" />
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <mat-paginator (page)="pageChanged()" [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons aria-label="Select page of periodic elements"> </mat-paginator>
    </div>
    <div class="d-flex justify-content-end mt-2">
      <button (click)="refresh()" class="btn btn-primary">Refresh</button>
    </div>
  `,
  styleUrls: ['list.component.style.css'],
})
export class ListComponent implements OnInit {
  constructor(private productService: ProductService, private spinner: NgxSpinnerService, private toastr: ToastrService) {}

  displayedColumns: string[] = ['name', 'stock', 'price', 'createdDate', 'updatedDate', 'delete', 'edit'];
  dataSource: MatTableDataSource<List_Product> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getProducts() {
    this.spinner.show();
    const allProducts: { totalCount: number; products: List_Product[] } = await this.productService.read(
      this.paginator ? this.paginator.pageIndex : 0,
      this.paginator ? this.paginator.pageSize : 5,
      () => this.spinner.hide(),
      (errorMessage) => {
        this.toastr.warning(errorMessage);
        this.spinner.hide();
      }
    );
    this.dataSource = new MatTableDataSource<List_Product>(allProducts.products);
    this.paginator.length = allProducts.totalCount;
  }
  async ngOnInit() {
    await this.getProducts();
  }
  async pageChanged() {
    await this.getProducts();
  }
  async refresh() {
    await this.getProducts();
  }
  formatDate(dateString: string): string {
    // date daha güzel görünür
    const date = new Date(dateString);
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
  }
  delete(id: string) {
    this.spinner.show();
    this.productService.delete(id.toUpperCase()).subscribe(() => {
      this.spinner.hide();
      this.toastr.success('Ürün Başarıyla Silindi');
    });
  }
}
