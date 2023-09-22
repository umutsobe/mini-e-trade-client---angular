import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BaseUrl } from 'src/app/contracts/base_url';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { List_Category } from 'src/app/contracts/category/list_category';
import { Error_DTO } from 'src/app/contracts/error_dto';
import { ProductFilter } from 'src/app/contracts/product/filter_product';
import { List_Product } from 'src/app/contracts/product/list_product';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { BasketService } from 'src/app/services/models/basket.service';
import { CategoryService } from 'src/app/services/models/category.service';
import { FileService } from 'src/app/services/models/file.service';
import { ProductService } from 'src/app/services/models/product.service';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="mt-1 mt-lg-5 px-0 px-lg-4">
      <div class="d-flex flex-column flex-lg-row">
        <!-- sadece lg altında gözükecek -->
        <div class="d-block d-lg-none d-flex justify-content-center mt-2 mb-- mb-lg-5">
          <div *ngIf="totalProductCount > 0" class="dropdown me-2" style="width: fit-content;">
            <div class="dropdown-toggle user-select-none" type="button" data-bs-toggle="dropdown" style="padding: 8px; border: 1px solid gray;border-radius: 5px; ">Sort By</div>
            <ul class="dropdown-menu dropstart">
              <li (click)="sortLowPrice()" type="button" class="dropdown-item">Lowest price</li>
              <li (click)="sortHighPrice()" type="button" class="dropdown-item">Highest price</li>
              <li (click)="sortSaleNumber()" type="button" class="dropdown-item">Bestsellers</li>
            </ul>
          </div>
          <button class="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters">Filters</button>
          <!-- filtre bottom offcanvas -->
          <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasFilters" style="height: fit-content;">
            <div class="offcanvas-header">
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body d-flex justify-content-center">
              <div class=" col-12 col-sm-8 col-md-6">
                <h1 class="text-center mt-1 mt-lg-4 mb-2 mb-lg-5">Filters</h1>

                <select class="form-select" (change)="categorySelected($event)">
                  <option selected>Category</option>
                  <option type="button" *ngFor="let category of categories" [selected]="productFilter.categoryName == category.name">{{ category.name }}</option>
                </select>

                <form #frm="ngForm" (ngSubmit)="assignFilters(frm.value)" class=" px-1 mt-4">
                  <div class="d-flex">
                    <input [(ngModel)]="this.productFilter.minPrice" name="min" ngModel type="number" class="form-control m-0 p-1 input me-2" placeholder="Min ₺" />
                    <input [(ngModel)]="this.productFilter.maxPrice" name="max" ngModel type="number" class="form-control m-0 p-1 input" placeholder="Max ₺" />
                  </div>
                  <button class="btn btn-warning mt-5" style="width: 100%;" data-bs-dismiss="offcanvas">Filter</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- filtre colonu lg sonrası için-->
        <div class="d-none d-lg-block d-flex justify-content-center">
          <div class="px-3 pb-3 mb-3 mb-lg-0" style="width: 230px; height: 500px; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;">
            <h1 class="text-center pt-2 mt-lg-4 mb-2 mb-lg-5">Filters</h1>

            <select class="form-select" (change)="categorySelected($event)">
              <option selected>Category</option>
              <option type="button" *ngFor="let category of categories" [selected]="productFilter.categoryName == category.name">{{ category.name }}</option>
            </select>

            <form #frm="ngForm" (ngSubmit)="assignFilters(frm.value)" class=" px-1 mt-4">
              <div class="d-flex">
                <input [(ngModel)]="this.productFilter.minPrice" name="min" ngModel type="number" class="form-control m-0 p-1 input me-2" placeholder="Min ₺" />
                <input [(ngModel)]="this.productFilter.maxPrice" name="max" ngModel type="number" class="form-control m-0 p-1 input" placeholder="Max ₺" />
              </div>
              <button class="btn btn-warning mt-5" style="width: 100%;">Filter</button>
            </form>
          </div>
        </div>
        <!-- products colonu -->
        <div class="px-2 p-0 mt-0" style="width: 100%;">
          <!-- products yoksa info -->
          <div class="d-flex justify-content-center" *ngIf="products.length < 1 && !spinnerBootstrap">
            <div class="alert alert-info ">No Results. Try checking your spelling or use more general terms.</div>
          </div>
          <!-- products list -->
          <div class="m-0">
            <!-- sort dropdown  lg sonrası için-->
            <div *ngIf="totalProductCount > 0" class="dropdown mt-1 mb-4 mb-lg-5 ps-4" style="width: fit-content;">
              <div class="d-none d-lg-block dropdown-toggle user-select-none" type="button" data-bs-toggle="dropdown" style="padding: 8px; border: 1px solid gray;border-radius: 5px; ">Sort By</div>
              <ul class="dropdown-menu dropstart">
                <li (click)="sortLowPrice()" type="button" class="dropdown-item">Lowest price</li>
                <li (click)="sortHighPrice()" type="button" class="dropdown-item">Highest price</li>
                <li (click)="sortSaleNumber()" type="button" class="dropdown-item">Bestsellers</li>
              </ul>
            </div>
            <!-- products -->
            <!-- api browser-->
            <div *ngIf="isBrowser" class="d-flex flex-wrap justify-content-center product-cards">
              <div *ngFor="let product of products" class="product-card card m-0 me-2 mb-2 cursor-pointer" style="width: 16rem;">
                <img (click)="routeToProductDetail(product.url)" *ngIf="!product.productImageShowCasePath && isBrowser" src="/assets/product.jpg" class="card-img-top mb-0" style="width: 100%;height: 200px;object-fit: cover;" type="button" />

                <img *ngIf="!isBrowser" src="/assets/preload.png" class="card-img-top mb-0" style="width: 100%;height: 200px;object-fit: cover;" type="button" />

                <img (click)="routeToProductDetail(product.url)" *ngIf="product.productImageShowCasePath && isBrowser" class="card-img-top mb-0" style="width: 100%;height: 200px;object-fit: cover;" type="button" [defaultImage]="defaultImage" [lazyLoad]="product.productImageShowCasePath" />

                <div class="card-body m-0 p-2">
                  <p (click)="routeToProductDetail(product.url)" type="button" class="product-name m-0 p-0 placeholder-glow" style="font-size: 16px;">{{ product.name }}</p>
                  <div style="height: 24px;" class="mt-1">
                    <div *ngIf="product.totalRatingNumber > 0" class="m-0 p-0 d-flex align-content-center">
                      <p-rating class="m-0 p-0" [(ngModel)]="product.averageStar" [readonly]="true" [cancel]="false" style="pointer-events: none; position: relative;"></p-rating> <span class="ms-1 ">{{ product.totalRatingNumber }}</span>
                    </div>
                  </div>
                  <h5 class="text-center mt-1 text-truncate" style="font-size: 18px;">{{ product.price | currency : '₺' }}</h5>
                  <button class="btn btn-primary btn-sm shadow-none w-100 mt-2" (click)="addToBasket(product)">Add to cart</button>
                </div>
              </div>
            </div>
            <!-- awdawd -->
            <div class="d-flex flex-wrap justify-content-center product-cards" *ngIf="!isBrowser" aria-hidden="true">
              <div *ngFor="let item of [].constructor(12)" class="product-card card m-0 me-2 mb-2 cursor-pointer" style="width: 16rem;">
                <img class="card-img-top mb-0 rounded-2" src="/assets/preload.png" style="width: 100%;height: 200px;object-fit: cover;" type="button" />

                <div class="card-body m-0 p-2">
                  <p type="button" class="product-name m-0 p-0 placeholder rounded-2" style="font-size: 16px;">a</p>
                  <div style="height: 24px;" class="mt-1">
                    <div style="height: 24px;" class="m-0 p-0 d-flex align-content-center placeholder rounded-2">star</div>
                  </div>
                  <h5 class="text-center mt-1 text-truncate placeholder rounded-2" style="font-size: 18px;">price</h5>
                  <button class="btn  btn-sm shadow-none w-100 mt-2 placeholder">-</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- pagination -->
      <nav *ngIf="totalPageCount > 1 && !spinnerBootstrap" aria-label="Page navigation example">
        <ul class="mt-4 pagination pagination justify-content-center">
          <div style="margin: 6px 8px 0 0;">{{ currentPageNo + 1 + '-' + totalPageCount }}</div>
          <li (click)="firstPage()" type="button" class="page-item page-link"><<</li>
          <li (click)="previousPage()" type="button" class="page-item page-link"><</li>
          <li (click)="nextPage()" type="button" class="page-item page-link">></li>
          <li (click)="lastPage()" type="button" class="page-item page-link">>></li>
        </ul>
      </nav>

      <!-- <li class="page-item" *ngFor="let pageNo of pageList" routerLinkActive="active">
        <a class="page-link " class="page-link" [routerLink]="['/products', pageNo]" (click)="scrollToTop()">{{ pageNo }}</a>
      </li> -->
    </div>
    <div *ngIf="!(totalProductCount > 0)!; spinnerBootstrap" style="margin-bottom: 700px;"></div>
  `,
  styles: [
    `
      * {
        margin: 0;
        box-shadow: none;
      }
      *:focus {
        box-shadow: none !important;
      }
      .page-link {
        box-shadow: none;
      }
      button {
        box-shadow: none;
      }
      .form-select {
        box-shadow: none;
      }
      .input {
        box-shadow: none;
      }
      /* number inputlardan arrow kaldırma */
      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      .product-name {
        font-weight: 500 !important;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        height: 36px;
      }

      @media (max-width: 560px) {
        .product-card {
          width: 49% !important;
          margin-right: 1px !important;
          margin-bottom: 8px !important;
        }
        .product-cards {
          margin: 0px !important;
          padding: 0px !important;
          flex: none;
        }
        .product-name {
          font-size: 15px !important;
          font-weight: 500 !important;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      ::ng-deep .p-rating-icon:not(.p-rating-cancel) {
        color: #ffa41c !important;
      }
      /* starlar arası margin */
      ::ng-deep .p-rating {
        gap: 2px;
      }
      /* star size */
      ::ng-deep .p-icon-wrapper {
        width: 14px !important;
      }
    `,
  ],
})
export class ProductListComponent {
  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private fileService: FileService, private basketService: BasketService, private spinner: NgxSpinnerService, private toastr: ToastrService, private authService: AuthService, private router: Router, private categoryService: CategoryService, @Inject(PLATFORM_ID) private platformId: Object) {}

  products: List_Product[] = [];
  categories: List_Category[] = [];

  currentPageNo: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize = 12; // GetProductsByFilterDTO'daki ile aynı olmalı
  pageList: number[] = [];
  baseUrl: BaseUrl;
  productFilter: ProductFilter;
  spinnerBootstrap = true;

  defaultImage = '/assets/preload.png';

  isBrowser: boolean;

  async ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId); //search prerender iyi çalışmıyor

    this.scrollToTop();

    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.queryStringBuilder(params);
      this.currentPageNo = +params['page'] || 0;
      this.baseUrl = await this.fileService.getBaseStorageUrl();
      this.spinnerBootstrap = true;

      let productData: { totalProductCount: number; products: List_Product[] };
      let categoryData: { categories: List_Category[]; totalCategoryCount: number };

      productData = await this.productService.getProductsByFilter(this.getQueryStringFromURL());

      this.products = productData.products;
      this.totalProductCount = productData.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

      categoryData = await this.categoryService.getCategories(0, 50);
      this.categories = categoryData.categories;

      this.products = this.products.map<List_Product>((p) => {
        const listProduct: List_Product = {
          id: p.id,
          createdDate: p.createdDate,
          productImageShowCasePath: p.productImageShowCasePath != null ? `${this.baseUrl.url}/${p.productImageShowCasePath}` : undefined,
          name: p.name,
          price: p.price,
          url: p.url,
          stock: p.stock,
          updatedDate: p.updatedDate,
          averageStar: p.averageStar,
          totalRatingNumber: p.totalRatingNumber,
        };

        return listProduct;
      });
      this.spinnerBootstrap = false;
    });
  }

  previousPage() {
    if (this.productFilter.page > 0) {
      this.productFilter.page--;
      this.navigateWithFilters();
    }
  }

  nextPage() {
    if (this.currentPageNo != this.totalPageCount - 1) {
      this.productFilter.page++;
      this.navigateWithFilters();
    }
  }
  firstPage() {
    this.productFilter.page = 0;
    this.navigateWithFilters();
  }
  lastPage() {
    this.productFilter.page = this.totalPageCount - 1;
    this.navigateWithFilters();
  }
  sortLowPrice() {
    this.productFilter.sort = 'asc';
    this.productFilter.page = 0;
    this.navigateWithFilters();
  }
  sortHighPrice() {
    this.productFilter.sort = 'desc';
    this.productFilter.page = 0;
    this.navigateWithFilters();
  }
  sortSaleNumber() {
    this.productFilter.sort = 'sales';
    this.productFilter.page = 0;
    this.navigateWithFilters();
  }

  private navigateWithFilters() {
    this.router.navigate(['/search'], { queryParams: this.productFilter }).then(() => {
      this.scrollToTop();
    });
  }

  getQueryStringFromURL() {
    if (typeof window !== 'undefined') {
      const currentURL = window.location.href;

      const queryString: string = currentURL.split('?')[1];

      return queryString;
    }
    return '';
  }
  queryStringBuilder(params: Params) {
    //queryString üzerinde müdahalade bulunuyorken bunu kullan

    this.productFilter = {
      //diğer parametreler undefined
      page: params['page'] || 0,
    };

    if (params['categoryName']) this.productFilter.categoryName = params['categoryName'];

    if (params['size']) this.productFilter.size = +params['size'];

    if (params['keyword']) this.productFilter.keyword = params['keyword'];

    if (params['minPrice']) this.productFilter.minPrice = +params['minPrice'];

    if (params['maxPrice']) this.productFilter.maxPrice = +params['maxPrice'];

    if (params['sort']) this.productFilter.sort = params['sort'];
  }

  async addToBasket(product: List_Product) {
    if (this.authService.isAuthenticated) {
      const _basketItem: Create_Basket_Item = new Create_Basket_Item();
      _basketItem.productId = product.id;
      _basketItem.quantity = 1;
      _basketItem.basketId = this.basketService.getBasketId();

      this.spinner.show();

      await this.basketService
        .add(_basketItem)
        .then((response: Error_DTO) => {
          if (response.succeeded == false) {
            this.toastr.error(response.message);
          } else {
            this.toastr.success('Added to Cart');
          }
          this.spinner.hide();
        })
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.toastr.info('You must log in to perform this action', 'Hata');
    }
  }

  categorySelected(event) {
    if (event.target.value != 'Category') {
      this.productFilter.categoryName = event.target.value;
    } else if (event.target.value == 'Category') this.productFilter.categoryName = undefined;
  }

  @ViewChild('frm', { static: true }) frm: NgForm;

  assignFilters(data: { min: number; max: number }) {
    if (data.max) this.productFilter.maxPrice = data.max;
    if (data.min) this.productFilter.minPrice = data.min;

    this.productFilter.page = 0;
    this.navigateWithFilters();
  }

  scrollToTop() {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }

  routeToProductDetail(url) {
    this.spinner.show();
    this.router.navigateByUrl(`/product/${url}`);
  }
}
// routerLink="/product/{{ product.url }}"
