import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { Error_DTO } from 'src/app/contracts/error_dto';
import { Image } from 'src/app/contracts/product/image';
import { List_Product } from 'src/app/contracts/product/list_product';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { BasketService } from 'src/app/services/models/basket.service';
import { FileService } from 'src/app/services/models/file.service';
import { ImageService } from 'src/app/services/models/image.service';
import { ProductService } from 'src/app/services/models/product.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="container-lg">
      <div class="carouselSection">
        <!-- carouselTop -->
        <div id="carouselTop" class="carousel slide carousel-fade" data-bs-ride="carousel" *ngIf="homePageImages.length > 0">
          <div class="carousel-inner w-100">
            <div *ngFor="let image of homePageImages; let isFirst = first" class="carousel-item rounded-2" [class.active]="isFirst">
              <img style="border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;" class="carousel-image w-100" height="400" alt="{{ image.fileName }}" [lazyLoad]="baseUrl + '/' + image.path" [defaultImage]="defaultGalleryImage" />
            </div>
          </div>
          <button *ngIf="homePageImages.length > 1" class="carousel-control-prev" type="button" data-bs-target="#carouselTop" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button *ngIf="homePageImages.length > 1" class="carousel-control-next" type="button" data-bs-target="#carouselTop" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <!-- bestsellers -->

      <div class="mt-4" style="width: 100%;">
        <div class="d-flex justify-content-center">
          <div class="mb-3 pb-1 border-bottom" style="font-size: 28px; font-weight: 600;">Bestsellers</div>
        </div>
        <div class="d-flex flex-wrap justify-content-center product-cards">
          <div *ngIf="isBrowser && spinnerBootstrap" class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div *ngFor="let product of products" class="product-card card m-0 me-2 mb-2 cursor-pointer" style="width: 16rem;">
            <img (click)="routeToProductDetail(product.url)" *ngIf="!product.productImageShowCasePath && isBrowser" src="/assets/product.webp" class="card-img-top mb-0" style="width: 100%;height: 200px;object-fit: contain;" type="button" />

            <img *ngIf="!isBrowser" src="/assets/dark-preload.webp" class="card-img-top mb-0" style="width: 100%;height: 200px;object-fit: contain;" type="button" />

            <img (click)="routeToProductDetail(product.url)" *ngIf="product.productImageShowCasePath && isBrowser" class="card-img-top mb-0" style="width: 100%;height: 200px;object-fit: contain;" type="button" [defaultImage]="defaultProductImage" [lazyLoad]="product.productImageShowCasePath" />

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
      </div>
    </div>
    <!-- card slider -->
  `,
  styles: [
    `
      *:focus {
        box-shadow: none !important;
      }
      .page-link {
        box-shadow: none;
      }
      button {
        box-shadow: none;
      }

      .carousel-image {
        object-fit: cover;
      }
      ::ng-deep .p-galleria-item-next-icon {
        color: #212529 !important;
      }
      ::ng-deep .p-galleria-item-prev-icon {
        color: #212529 !important;
      }
      .product-card img {
        border-radius: 5px;
      }
      .product-name {
        font-weight: 500 !important;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        height: 36px;
      }
      .carouselSection {
        height: 400px;
      }

      @media (max-width: 900px) {
        .carousel-image {
          height: 250px;
        }

        .carouselSection {
          height: 250px;
        }
      }

      @media (max-width: 570px) {
        .carousel-image {
          height: 150px;
        }
        .carouselSection {
          height: 150px;
        }
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
export class HomeComponent implements OnInit {
  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private imageService: ImageService, private fileService: FileService, @Inject(PLATFORM_ID) private platformId: Object, private spinner: NgxSpinnerService, private toastr: ToastrService, private router: Router, private authService: AuthService, private basketService: BasketService) {}
  homePageImages: Image[] = [];
  baseUrl: string = '';
  defaultGalleryImage = '/assets/dark-preload-home-galleria.jpg';
  defaultProductImage = '/assets/dark-preload.webp';
  isBrowser = false;
  products: List_Product[] = [];
  totalProductCount: number;
  totalPageCount: number;
  pageSize = 12; // GetProductsByFilterDTO'daki ile aynı olmalı
  spinnerBootstrap = true;
  bestsellerQueryString = 'page=0&sort=sales&size=8';

  async ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId); //search prerender iyi çalışmıyor

    this.homePageImages = await this.imageService.getImagesByDefinition('home');
    this.baseUrl = (await this.fileService.getBaseStorageUrl()).url;

    this.getProductsByFilter();
    this.spinnerBootstrap = false;
  }

  async getProductsByFilter() {
    let productData: { totalProductCount: number; products: List_Product[] };

    productData = await this.productService.getProductsByFilter(this.bestsellerQueryString);

    this.products = productData.products;
    this.totalProductCount = productData.totalProductCount;
    this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

    this.products = this.products.map<List_Product>((p) => {
      const listProduct: List_Product = {
        id: p.id,
        createdDate: p.createdDate,
        productImageShowCasePath: p.productImageShowCasePath != null ? `${this.baseUrl}/${p.productImageShowCasePath}` : undefined,
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
  }

  routeToProductDetail(url) {
    this.spinner.show();
    this.router.navigateByUrl(`/product/${url}`);
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
      this.toastr.info('You must login to perform this action');
    }
  }
}
