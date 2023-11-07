import { Component, OnInit, ViewChild } from '@angular/core';
import { List_Product } from 'src/app/contracts//product/list_product';
import { ProductService } from 'src/app/services/models/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { formatDate } from '@angular/common';
import { IdExchangeService } from 'src/app/services/data-exchange/id-exchange.service';
import { List_Category } from 'src/app/contracts/category/list_category';
import { CategoryService } from 'src/app/services/models/category.service';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ProductFilter } from 'src/app/contracts/filter_product';
import { Subject, debounceTime } from 'rxjs';
import { List_Product_Admin } from 'src/app/contracts/product/list_Product_Admin';
import { ProductPhotoModalComponent } from '../modals/product-photo-modal/product-photo-modal.component';
import { ProductCategoryModalComponent } from '../modals/product-category-modal/product-category-modal.component';
import { UpdateProductModalComponent } from '../modals/update-product-modal/update-product-modal.component';

@Component({
  selector: 'app-list',
  template: `
    <h1 class="mt-2 text-center" id="title">Products</h1>
    <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px;">
      <!-- filters -->
      <div class="d-flex mb-2 align-items-center">
        <form class="d-flex" style="height: 40px">
          <input [(ngModel)]="productFilter.keyword" (input)="onInputKeyup()" style="width: 120px;" name="onemsiz" class="form-control me-2 " placeholder="Search" />
          <!-- <button type="button" class="btn btn-warning"><fa-icon class="fs-5 me-1" [icon]="faMagnifyingGlass"></fa-icon></button> -->
        </form>
        <div class="d-block d-md-flex align-items-center justify-content-center">
          <div class="dropdown me-1" style="width: fit-content;">
            <div class="dropdown-toggle user-select-none" type="button" data-bs-toggle="dropdown" style="padding: 8px; border: 1px solid gray;border-radius: 5px; ">Sort By</div>
            <ul class="dropdown-menu dropstart">
              <li (click)="sortLowPrice()" type="button" class="dropdown-item">Lowest Price</li>
              <li (click)="sortHighPrice()" type="button" class="dropdown-item">Highest Price</li>
              <li (click)="sortSaleNumber()" type="button" class="dropdown-item">Bestsellers</li>
              <!-- <li type="button" class="dropdown-item">Newly products</li> -->
            </ul>
          </div>
          <select *ngIf="categories" class="mt-1 mt-sm-1 mt-sm-1 mt-md-0 form-select" (change)="categorySelected($event)" style="width: fit-content; border: 1px solid gray">
            <option selected>Category</option>
            <option type="button" *ngFor="let category of categories.categories">{{ category.name }}</option>
          </select>
        </div>
      </div>
      <!-- tablo -->
      <div class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead>
            <tr class="text-center">
              <th scope="col">Name</th>
              <th scope="col">Stock</th>
              <th scope="col">Price</th>
              <th scope="col">Total Sales Count</th>
              <th scope="col">Is Active</th>
              <!-- <th scope="d-md-none">Select Category</th> -->
              <th scope="col">Photo</th>
              <!-- <th scope="col">Delete</th> -->
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody *ngIf="this.allProducts">
            <tr *ngFor="let product of this.allProducts.products" class="text-center">
              <td class="item">
                <a class="text-decoration-none" routerLink="/product/{{ product.url }}">{{ product.name }}</a>
              </td>
              <td>{{ product.stock }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.totalOrderNumber }}</td>
              <td>
                <img *ngIf="product.isActive" type="button" src="/assets/completed.png" width="25" style="cursor:pointer;" />
              </td>
              <td>
                <img type="button" data-bs-toggle="modal" data-bs-target="#selectPhotoModal" (click)="openPhotoDialog(product)" src="/assets/photo.png" width="25" style="cursor:pointer;" />
              </td>
              <td>
                <div class="dropdown">
                  <img class="dropdown-toggle" src="/assets/edit.png" width="25" style="cursor:pointer;" data-bs-toggle="dropdown" />

                  <ul class="dropdown-menu dropdown-menu-start">
                    <li role="button" data-bs-toggle="modal" data-bs-target="#categoryModal" (click)="openCategoryDialog(product)" class="dropdown-item text-truncate">Select Category</li>
                    <li data-bs-toggle="modal" data-bs-target="#selectPhotoModal" (click)="openPhotoDialog(product)" role="button" class="dropdown-item">Select Photo</li>
                    <li data-bs-toggle="modal" data-bs-target="#updateModal" (click)="openUpdateProductDialog(product)" role="button" class="dropdown-item">Update Product</li>
                    <li><hr class="dropdown-divider" /></li>
                    <li data-bs-toggle="modal" data-bs-target="#deleteModal" (click)="openDeleteDialog(product)" role="button" class="dropdown-item">!Delete</li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
          <div *ngIf="this.allProducts.products.length < 1 && !isLoading" class="my-2 alert alert-info">Product not found</div>
        </table>
      </div>

      <!-- pagination -->
      <div *ngIf="!(this.allProducts.products.length < 1)" class="mt-4 pagination d-flex justify-content-center">
        <div style="margin: 6px 8px 0 0;">{{ productFilter.page + 1 + '-' + totalPageCount }}</div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="firstPage()"><<</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="previousPage()"><</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="nextPage()">></a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="lastPage()">>></a></div>
      </div>
    </div>

    <!-- delete dialog -->
    <app-product-delete-modal [selectedProduct]="selectedProduct"></app-product-delete-modal>

    <!-- photo dialog -->
    <app-product-photo-modal [selectedProduct]="selectedProduct"></app-product-photo-modal>

    <!-- category modal -->
    <app-product-category-modal [selectedProduct]="selectedProduct"></app-product-category-modal>

    <!-- update product modal -->
    <app-update-product-modal [selectedProduct]="selectedProduct"></app-update-product-modal>
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
      td {
        margin: 0;
        padding-left: 3px;
        padding-right: 3px;
      }
      .item {
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        max-height: 46px;
      }
      .dropdown-menu {
        z-index: 9999;
      }
    `,
  ],
})
export class ListComponent implements OnInit {
  constructor(private productService: ProductService, private spinner: NgxSpinnerService, private idService: IdExchangeService, private categoryService: CategoryService) {
    this.inputChangeSubject.pipe(debounceTime(this.searchInputDelayTime)).subscribe(() => {
      //search inputu gecikmeli arama
      this.onSearchInputChange();
    });
  }

  allProducts: { totalProductCount: number; products: List_Product_Admin[] } = {
    totalProductCount: 0,
    products: [],
  };
  totalProductCount: number;
  totalPageCount: number;
  pageSize = 8;
  productFilter: ProductFilter = {
    page: 0,
    keyword: '',
  };
  faMagnifyingGlass = faMagnifyingGlass;
  private inputChangeSubject = new Subject<string>();
  searchInputDelayTime = 300;
  isLoading = true;

  async getProducts() {
    this.spinner.show();
    const allProducts: { totalProductCount: number; products: List_Product_Admin[] } = await this.productService.getProductsByFilterAdmin(this.queryStringBuilder());
    this.allProducts = allProducts;
    this.totalProductCount = allProducts.totalProductCount;
    this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

    this.spinner.hide();
  }
  selectedProduct: List_Product = { id: '' };
  categories: { categories: List_Category[]; totalCategoryCount: number };

  openDeleteDialog(element: List_Product) {
    this.selectedProduct = element;
  }

  @ViewChild(ProductPhotoModalComponent) productPhotoModalComponent: ProductPhotoModalComponent;
  openPhotoDialog(element) {
    this.selectedProduct = element;
    this.idService.setId(element.id); // file upload componentin hangi id ile işlem yapacağını söylüyor

    this.productPhotoModalComponent.listProductPhotos(this.selectedProduct.id);
  }

  @ViewChild(ProductCategoryModalComponent) productCategoryModalComponent: ProductCategoryModalComponent;
  categoryModalLoaded = false;
  openCategoryDialog(product: List_Product) {
    this.selectedProduct = product;
    this.categoryModalLoaded = true;

    this.productCategoryModalComponent.getCategories(product.id);
  }
  @ViewChild(UpdateProductModalComponent) productUpdateModalComponent: UpdateProductModalComponent;
  openUpdateProductDialog(product: List_Product) {
    this.selectedProduct = product;

    this.productUpdateModalComponent.getProduct(this.selectedProduct);
  }

  formatDate(dateString: string): string {
    // date daha güzel görünür

    const date = new Date(dateString);
    if (typeof window !== 'undefined') if (window.innerWidth < 600) return formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
  }

  sortLowPrice() {
    this.productFilter.sort = 'asc';
    this.productFilter.page = 0;
    this.getProducts();
  }
  sortHighPrice() {
    this.productFilter.sort = 'desc';
    this.productFilter.page = 0;
    this.getProducts();
  }
  sortSaleNumber() {
    this.productFilter.sort = 'sales';
    this.productFilter.page = 0;
    this.getProducts();
  }

  categorySelected(event) {
    if (event.target.value != 'Category') {
      this.productFilter.categoryName = event.target.value;
    } else if (event.target.value == 'Category') this.productFilter.categoryName = undefined;

    this.getProducts();
  }

  previousPage() {
    if (this.productFilter.page > 0) {
      this.productFilter.page--;
      this.getProducts();
    }
  }
  nextPage() {
    if (this.productFilter.page != this.totalPageCount - 1) {
      this.productFilter.page++;
      this.getProducts();
    }
  }
  firstPage() {
    if (this.productFilter.page != 0) {
      this.productFilter.page = 0;
      this.getProducts();
    }
  }
  lastPage() {
    if (this.productFilter.page != this.totalPageCount - 1) {
      this.productFilter.page = this.totalPageCount - 1;
      this.getProducts();
    }
  }

  queryStringBuilder(): string {
    let queryString = 'size=8';

    if (this.productFilter.categoryName) queryString += `&categoryName=${this.productFilter.categoryName}`;

    if (this.productFilter.page) queryString += `&page=${this.productFilter.page}`;

    if (this.productFilter.keyword) queryString += `&keyword=${this.productFilter.keyword}`;

    if (this.productFilter.minPrice) queryString += `&minPrice=${this.productFilter.minPrice}`;

    if (this.productFilter.maxPrice) queryString += `&maxPrice=${this.productFilter.maxPrice}`;

    if (this.productFilter.sort) queryString += `&sort=${this.productFilter.sort}`;

    return queryString;
  }

  onInputKeyup() {
    // Ancak debounceTime ile 300 ms gecikmeli olarak onSearchInputChange'e olay gönderir.
    this.inputChangeSubject.next(this.productFilter.keyword);
  }

  onSearchInputChange() {
    this.getProducts();
  }

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories(0, 100);
    await this.getProducts();
    this.isLoading = false;
  }
  async pageChanged() {
    await this.getProducts();
  }
  async refresh() {
    await this.getProducts();
  }
}
