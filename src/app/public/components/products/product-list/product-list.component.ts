import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BaseUrl } from 'src/app/contracts/base_url';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { List_Category } from 'src/app/contracts/category/list_category';
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
    <div class="mt-5 px-4">
      <div class="d-flex">
        <!-- filtre colonu -->
        <div class="col-2 m-0 px-3 d-flex justify-content-center d-none d-lg-block" style="width: 230px; height: 600px; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;">
          <h1 class="text-center mt-4 mb-5">Filtreler</h1>

          <select class="form-select" (change)="categorySelected($event)">
            <option selected>Kategori</option>
            <option type="button" *ngFor="let category of categories" [selected]="productFilter.categoryName == category.name">{{ category.name }}</option>
          </select>

          <form #frm="ngForm" (ngSubmit)="assignFilters(frm.value)" class=" px-1 mt-4">
            <div class="d-flex">
              <input [(ngModel)]="this.productFilter.minPrice" name="min" ngModel type="number" class="form-control m-0 p-1 input me-2" placeholder="Min ₺" />
              <input [(ngModel)]="this.productFilter.maxPrice" name="max" ngModel type="number" class="form-control m-0 p-1 input" placeholder="Max ₺" />
            </div>
            <button class="btn btn-warning mt-5" style="width: 100%;">Filtrele</button>
          </form>
        </div>
        <!-- products colonu -->
        <div class="px-2" style="width: 100%;">
          <!-- products yoksa info -->
          <div *ngIf="!(totalProductCount > 0) && !spinnerBootstrap" class="d-flex justify-content-center">
            <div class="alert alert-info ">Aradığınız kriterlere uygun ürün bulunamadı</div>
          </div>
          <!-- products list -->
          <div class="m-0">
            <!-- spinner -->
            <!-- <div class="text-center d-flex justify-content-center" style="width: 80%; position: absolute;">
              <div *ngIf="spinnerBootstrap" class="spinner-border text-primary" role="status"></div>
            </div> -->

            <!-- sort dropdown -->
            <div *ngIf="totalProductCount > 0" class="dropdown mt-1 mb-5 ps-4" style="width: fit-content;">
              <div class="dropdown-toggle user-select-none" type="button" data-bs-toggle="dropdown" style="padding: 8px; border: 1px solid gray;border-radius: 5px; ">Sıralama</div>
              <ul class="dropdown-menu dropstart">
                <li (click)="sortLowPrice()" type="button" class="dropdown-item">En düşük fiyat</li>
                <li (click)="sortHighPrice()" type="button" class="dropdown-item">En yüksek fiyat</li>
                <li (click)="sortSaleNumber()" type="button" class="dropdown-item">Çok satanlar</li>
              </ul>
            </div>
            <!-- products -->
            <div class="d-flex flex-wrap justify-content-center">
              <div *ngFor="let product of products" class="card m-0 me-2 mb-2 cursor-pointer" style="width: 16rem;">
                <img routerLink="/product/{{ product.url }}" *ngIf="!product.productImageShowCasePath" src="/assets/product.jpg" class="card-img-top mb-0" style="width: 100%;height: 200px;object-fit: cover;" type="button" />
                <img routerLink="/product/{{ product.url }}" *ngIf="product.productImageShowCasePath" src="{{ this.baseUrl.url }}/{{ product.productImageShowCasePath }}" class="card-img-top mb-0" style="width: 100%;height: 200px;object-fit: cover;" type="button" />

                <div class="card-body m-0">
                  <h5 routerLink="/product/{{ product.url }}" type="button" class="card-header mt-0 p-0 text-truncate placeholder-glow " style="font-size: 18px;">{{ product.name }}</h5>
                  <h5 class="text-center mt-1 text-truncate" style="font-size: 18px;">{{ product.price | currency : '₺' }}</h5>
                  <button class="btn btn-primary btn-sm shadow-none w-100 mt-2" (click)="addToBasket(product)">Sepete Ekle</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav *ngIf="totalPageCount > 1 && !spinnerBootstrap" aria-label="Page navigation example">
        <ul class="mt-4 pagination pagination justify-content-center">
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
    `,
  ],
})
export class ProductListComponent {
  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private fileService: FileService, private basketService: BasketService, private spinner: NgxSpinnerService, private toastr: ToastrService, private authService: AuthService, private router: Router, private categoryService: CategoryService) {}

  products: List_Product[] = [];
  categories: List_Category[] = [];

  currentPageNo: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 12; // GetProductsByFilterDTO'daki ile aynı olmalı
  pageList: number[] = [];
  baseUrl: BaseUrl;
  productFilter: ProductFilter;
  spinnerBootstrap: boolean = true;

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.spinner.show();
      this.queryStringBuilder(params);
      this.currentPageNo = +params['page'] || 0;
      this.baseUrl = await this.fileService.getBaseStorageUrl();

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
          productImageShowCasePath: p.productImageShowCasePath,
          name: p.name,
          price: p.price,
          url: p.url,
          stock: p.stock,
          updatedDate: p.updatedDate,
        };

        return listProduct;
      });

      this.pageList = [];

      if (this.totalPageCount >= 5) {
        if (this.currentPageNo - 2 <= 0) for (let i = 1; i <= 5; i++) this.pageList.push(i);
        else if (this.currentPageNo + 2 >= this.totalPageCount) for (let i = this.totalPageCount - 4; i <= this.totalPageCount; i++) this.pageList.push(i);
        else for (let i = this.currentPageNo - 2; i <= this.currentPageNo + 2; i++) this.pageList.push(i);
      } else {
        for (let i = 1; i <= this.totalPageCount; i++) this.pageList.push(i);
      }

      this.spinnerBootstrap = false;
      this.spinner.hide();
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
    const currentURL = window.location.href;

    const queryString: string = currentURL.split('?')[1];

    return queryString;
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
      let _basketItem: Create_Basket_Item = new Create_Basket_Item();
      _basketItem.productId = product.id;
      _basketItem.quantity = 1;
      _basketItem.basketId = this.basketService.getBasketId();

      this.spinner.show();

      await this.basketService
        .add(_basketItem)
        .then(() => {
          this.spinner.hide();
          this.toastr.success('Ürün sepete eklenmiştir', 'Başarılı');
        })
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.toastr.warning('Bu işlemi yapmak için giriş yapmalısınız', 'Hata');
    }
  }

  categorySelected(event) {
    if (event.target.value != 'Kategori') {
      this.productFilter.categoryName = event.target.value;
    } else if (event.target.value == 'Kategori') this.productFilter.categoryName = undefined;
  }

  @ViewChild('frm', { static: true }) frm: NgForm;

  assignFilters(data: { min: number; max: number }) {
    if (data.max) this.productFilter.maxPrice = data.max;
    if (data.min) this.productFilter.minPrice = data.min;

    this.productFilter.page = 0;
    this.navigateWithFilters();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
