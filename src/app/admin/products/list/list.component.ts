import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { List_Product } from 'src/app/contracts//product/list_product';
import { ProductService } from 'src/app/services/models/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { IdExchangeService } from 'src/app/services/data-exchange/id-exchange.service';
import { List_Product_Image } from 'src/app/contracts/product/list_product_image';
import { List_Category } from 'src/app/contracts/category/list_category';
import { MatSelectionList } from '@angular/material/list';
import { CategoryService } from 'src/app/services/models/category.service';
declare var $: any;
@Component({
  selector: 'app-list',
  template: `
    <h1 class="mt-2 text-center" id="title">Products</h1>
    <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px;">
      <table class="table table-striped table-responsive">
        <thead>
          <tr class="text-center">
            <th scope="col">Name</th>
            <th scope="col">Stock</th>
            <th scope="col">Price</th>
            <th scope="col">Created Date</th>
            <th scope="col">Select Category</th>
            <th scope="col">Photo</th>
            <th scope="col">Delete</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody *ngIf="this.allProducts">
          <tr *ngFor="let product of this.allProducts.products" class="text-center">
            <td>{{ product.name }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ product.price }}</td>
            <td>{{ formatDate(product.createdDate.toString()) }}</td>
            <td>
              <button data-bs-toggle="modal" data-bs-target="#categoryModal" (click)="openCategoryDialog(product)" class="btn btn-primary btn-sm">Category</button>
            </td>
            <td>
              <img type="button" data-bs-toggle="modal" data-bs-target="#selectPhotoModal" (click)="openPhotoDialog(product)" src="/assets/photo.png" width="25" style="cursor:pointer;" />
            </td>
            <td>
              <img type="button" data-bs-toggle="modal" data-bs-target="#deleteModal" (click)="openDeleteDialog(product)" src="/assets/delete.png" width="25" style="cursor:pointer;" />
            </td>
            <td>
              <img src="/assets/edit.png" width="25" style="cursor:pointer;" />
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
                <span class="m-1 d-flex">
                  Is Showcase?
                  <input class="ms-1 my-1 form-check-input" type="radio" name="img" (click)="showCase(x.id)" />
                </span>

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

    <!-- category modal -->

    <div class="modal fade" id="categoryModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body">
            <h2>{{ selectedProduct ? selectedProduct.name : '' }}</h2>
            <mat-selection-list #categoryComponent>
              <mat-list-option *ngFor="let category of listCategories" selected="{{ category.selected }}">
                {{ category.name }}
              </mat-list-option>
            </mat-selection-list>
          </div>
          <div class="modal-footer">
            <button (click)="assignCategories(categoryComponent)" type="button" class="btn btn-primary">Kategorileri Ata</button>
            <button (click)="closeCategoryDialog()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* mat selection list kullanan her yere yapıştır. dark theme'de sorun çıkıyor */

      *:focus {
        box-shadow: none !important;
      }

      ::ng-deep .mat-mdc-list-item-unscoped-content {
        color: #8f8979 !important;
      }
      ::ng-deep .mdc-checkbox__background {
        border-color: #8f8979 !important;
      }
      .page-item {
        user-select: none;
      }
    `,
  ],
})
export class ListComponent implements OnInit {
  constructor(private productService: ProductService, private spinner: NgxSpinnerService, private toastr: ToastrService, private idService: IdExchangeService, private categoryService: CategoryService) {}

  allProducts: { totalProductCount: number; products: List_Product[] };
  currentPageNo: number = 0;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 8;

  async getProducts() {
    this.spinner.show();
    const allProducts: { totalProductCount: number; products: List_Product[] } = await this.productService.read(
      this.currentPageNo,
      this.pageSize,
      () => this.spinner.hide(),
      (errorMessage) => {
        this.toastr.warning(errorMessage);
        this.spinner.hide();
      }
    );
    this.allProducts = allProducts;
    this.totalProductCount = allProducts.totalProductCount;
    this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);
  }

  prev() {
    if (this.currentPageNo > 0) {
      this.currentPageNo--;
      this.getProducts();
    }
  }
  next() {
    if (this.currentPageNo != this.totalPageCount - 1) {
      this.currentPageNo++;
      this.getProducts();
    }
  }
  first() {
    this.currentPageNo = 0;
    this.getProducts();
  }
  last() {
    this.currentPageNo = this.totalPageCount - 1;
    this.getProducts();
  }
  //dialog penceresinde seçilen ürün
  selectedProduct: List_Product;

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
  showCase(imageId: string) {
    this.spinner.show();

    this.productService.changeShowcaseImage(imageId, this.selectedProduct.id as string, () => {
      this.spinner.hide();
    });
  }

  formatDate(dateString: string): string {
    // date daha güzel görünür

    const date = new Date(dateString);
    if (window.innerWidth < 600) return formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
  }

  categories: { categories: List_Category[]; totalCategoryCount: number };
  assignedCategories: Array<string> = [];
  listCategories: { name: string; selected: boolean }[];

  async openCategoryDialog(element) {
    this.selectedProduct = element;
    this.assignedCategories = await this.productService.getCategoriesByProductId(element.id);

    this.categories = await this.categoryService.getCategories(0, 100);

    this.listCategories = this.categories.categories.map((r: any) => {
      return {
        name: r.name,
        selected: this.assignedCategories?.indexOf(r.name) > -1,
      };
    });
  }

  assignCategories(categoryComponent: MatSelectionList) {
    this.spinner.show();
    const categories: string[] = categoryComponent.selectedOptions.selected.map((o) => o._elementRef.nativeElement.innerText);
    this.productService
      .assignCategoriesToProduct(this.selectedProduct.id, categories)
      .then(() => {
        this.toastr.success('Kategoriler Başarıyla Atandı');
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  closeCategoryDialog() {
    this.listCategories = [];
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
