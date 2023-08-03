import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { List_Product } from 'src/app/contracts/list_product';
import { ProductService } from 'src/app/services/models/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { IdExchangeService } from 'src/app/services/data-exchange/id-exchange-service';
import { List_Product_Image } from 'src/app/contracts/list_product_image';
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
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let element">{{ element.price }}</td>
        </ng-container>

        <ng-container matColumnDef="createdDate">
          <th mat-header-cell *matHeaderCellDef>CreatedDate</th>
          <td mat-cell *matCellDef="let element">{{ formatDate(element.createdDate) }}</td>
        </ng-container>

        <ng-container matColumnDef="updatedDate">
          <th mat-header-cell *matHeaderCellDef>UpdatedDate</th>
          <td mat-cell *matCellDef="let element">
            {{ formatDate(element.updatedDate) == '0001-01-01 00:00:00' ? '-' : formatDate(element.updatedDate) }}
          </td>
        </ng-container>

        <ng-container matColumnDef="photo">
          <th mat-header-cell *matHeaderCellDef>Photo</th>
          <td mat-cell *matCellDef="let element">
            <img type="button" data-bs-toggle="modal" data-bs-target="#selectPhotoModal" (click)="openPhotoDialog(element)" src="/assets/photo.png" width="25" style="cursor:pointer;" />
            <!-- dialog -->
          </td>
        </ng-container>

        <ng-container matColumnDef="delete">
          <th mat-header-cell *matHeaderCellDef>Delete</th>
          <td mat-cell *matCellDef="let element">
            <!-- <img (click)="delete(element.id)" src="/assets/delete.png" width="25" style="cursor:pointer;" /> -->
            <img type="button" data-bs-toggle="modal" data-bs-target="#deleteModal" (click)="openDeleteDialog(element)" src="/assets/delete.png" width="25" style="cursor:pointer;" />
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

      <mat-paginator (page)="pageChanged()" [pageSizeOptions]="[5, 10]" showFirstLastButtons aria-label="Select page of periodic elements"> </mat-paginator>
    </div>
    <div class="d-flex justify-content-end mt-2">
      <button (click)="refresh()" id="refresh" class="btn btn-primary">Refresh</button>
    </div>

    <!-- ---------------------------------------------Dialogs---------------------------------------- -->

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
            <p>Silinecek Ürün: {{ selectedProduct ? selectedProduct.name : '' }}</p>
            <!-- null hatası almamak için kontrol -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button (click)="delete()" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- photo dialog -->

    <div class="modal fade" id="selectPhotoModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Ürün Fotoğraf Ekleme</h1>
            <div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          </div>
          <p class="ms-3 mt-2">Ürün Id: {{ selectedProduct ? selectedProduct.id : '' }}</p>
          <p class="ms-3 mt-2">Ürün İsmi {{ selectedProduct ? selectedProduct.name : '' }}</p>
          <div class="modal-body">
            <h4 class="text-center">Ürüne Fotoğraf Ekle</h4>
            <app-file-upload></app-file-upload>
            <!-- appfilecomponent child componenttir bu componentte göre -->
          </div>
          <div class="list-images">
            <h4 class="text-center">Ürün Fotoğrafları</h4>
            <div class="d-flex flex-wrap justify-content-center">
              <div *ngFor="let x of productImages" class="card m-1" style="width:11rem">
                <img src="{{ x.path }}" class="card-img-top" />
                <div class="card-body text-center">
                  <button (click)="deleteImage(selectedProduct.id, x.id)" class="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ListComponent implements OnInit {
  constructor(private productService: ProductService, private spinner: NgxSpinnerService, private toastr: ToastrService, private idService: IdExchangeService) {}

  displayedColumns: string[] = ['name', 'stock', 'price', 'createdDate', 'updatedDate', 'photo', 'delete', 'edit'];
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

  //dialog penceresinde seçilen ürün
  selectedProduct: List_Product; // dialog penceresinde sorun yaşadım. o anki element id'ye erişemiyordum ben de böyle çözüm sağladım.

  openDeleteDialog(element: List_Product) {
    this.selectedProduct = element;
  }
  delete() {
    this.spinner.show();
    this.productService.delete(this.selectedProduct.id).subscribe(() => {
      this.spinner.hide();
      this.toastr.success('Ürün Başarıyla Silindi');
      this.getProducts();
    });
  }

  productImages: List_Product_Image[];

  openPhotoDialog(element) {
    this.selectedProduct = element;
    this.idService.setId(element.id); // file upload componentin hangi id ile işlem yapacağını söylüyor
    this.listProductPhotos(element.id);
  }

  listProductPhotos(id: string) {
    this.spinner.show('Resimler Yükleniyor');
    this.productService.readImages(id).subscribe(
      (response) => {
        this.productImages = response;
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }
  deleteImage(productId: string, imageId: string) {
    this.spinner.show('Resim Siliniyor...');
    this.productService.deleteImage(productId, imageId).subscribe(
      () => {
        this.spinner.hide();
        this.listProductPhotos(productId);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  formatDate(dateString: string): string {
    // date daha güzel görünür
    const date = new Date(dateString);
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
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
}
