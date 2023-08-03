import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { List_Product } from 'src/app/contracts/list_product';
import { ProductService } from 'src/app/services/models/product.service';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="row mt-5" style="width: 100%;">
      <div class="col-3">
        <h1 class="text-center">Filters</h1>
      </div>
      <div class="col-9">
        <div class="d-flex flex-wrap">
          <div type="button" *ngFor="let product of products" class="card me-2 mb-2 product-card cursor-pointer" style="width: 16rem;">
            <img src="/assets/product.jpg" class="card-img-top mb-0" />
            <div class="card-body m-0">
              <h5 class="card-header mt-0 p-0" style="font-size: 18px;">{{ product.name }}</h5>
              <div class="fa-star"></div>
              <h5 class="text-center mt-1" style="font-size: 18px;">{{ product.price | currency : '₺' }}</h5>
              <button class="btn btn-primary btn-sm shadow-none w-100 mt-2">Sepete Ekle</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <nav aria-label="Page navigation example">
      <ul class="mt-4 pagination pagination justify-content-center">
        <li class="page-item"><a class="page-link" [routerLink]="['/products', currentPageNo - 1 <= 0 ? 1 : currentPageNo - 1]">Previous</a></li>
        <li class="page-item" *ngFor="let pageNo of pageList" routerLinkActive="active">
          <a class="page-link " class="page-link" [routerLink]="['/products', pageNo]" (click)="scrollToTop()">{{ pageNo }}</a>
        </li>
        <li class="page-item"><a class="page-link" [routerLink]="['/products', currentPageNo + 1 >= totalPageCount ? totalPageCount : currentPageNo + 1]">Next</a></li>
      </ul>
    </nav>
  `,
  styles: [
    `
      .page-link {
        box-shadow: none;
      }
      button {
        box-shadow: none;
      }
    `,
  ],
})
export class ProductListComponent {
  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute) {}

  products: List_Product[];
  currentPageNo: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 12;
  pageList: number[] = [];
  // baseUrl: BaseUrl;

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  async ngOnInit() {
    // this.baseUrl = await this.fileService.getBaseStorageUrl();

    this.activatedRoute.params.subscribe(async (params) => {
      this.currentPageNo = parseInt(params['pageNo'] ?? 1);

      const data: { totalProductCount: number; products: List_Product[] } = await this.productService.read(
        this.currentPageNo - 1,
        this.pageSize,
        () => {},
        (errorMessage) => {}
      );

      this.products = data.products;

      // this.products = this.products.map<List_Product>((p) => {
      //   const listProduct: List_Product = {
      //     id: p.id,
      //     createdDate: p.createdDate,
      //     imagePath: p.productImageFiles.length ? p.productImageFiles.find((p) => p.showcase).path : '',
      //     name: p.name,
      //     price: p.price,
      //     stock: p.stock,
      //     updatedDate: p.updatedDate,
      //     productImageFiles: p.productImageFiles,
      //   };

      //   return listProduct;
      // });

      this.totalProductCount = data.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

      this.pageList = [];

      if (this.currentPageNo - 3 <= 0) for (let i = 1; i <= 7; i++) this.pageList.push(i);
      else if (this.currentPageNo + 3 >= this.totalPageCount) for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++) this.pageList.push(i);
      else for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++) this.pageList.push(i);
    });
  }
}
