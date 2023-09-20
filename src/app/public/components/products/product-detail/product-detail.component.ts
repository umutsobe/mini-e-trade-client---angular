import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { List_Product_Detail } from 'src/app/contracts/product/lis_product_detail';
import { ProductService } from 'src/app/services/models/product.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';
import { BasketService } from 'src/app/services/models/basket.service';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { ToastrService } from 'ngx-toastr';
import { FileService } from 'src/app/services/models/file.service';
import { PhotoSliderObject } from 'src/app/contracts/product/photoSlider/photoSliderObject';
import { NgImageSliderComponent } from 'ng-image-slider';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { ProuductRatingService } from 'src/app/services/models/prouduct-rating.service';
import { Error_DTO } from 'src/app/contracts/error_dto';

@Component({
  selector: 'app-product-detail',
  template: `
    <!-- sayfa yenilemeden routing yaparken footer gözükmsein diye önlem -->
    <div *ngIf="isLoading" style="height: 100vh;"></div>
    <!-- all component -->
    <div *ngIf="!productNotFound && !isLoading">
      <section *ngIf="product && !isLoading" class="py-0 mt-2 mt-md-5">
        <div class="container-sm">
          <!-- <nav class="mb-3">Electronics > Cell Phones > {{ product ? product.name : '' }}</nav> -->
          <div class="row  mb-5 mb-lg-8">
            <div class="col-12 col-lg-6">
              <div class="row mb-3 d-flex justify-content-center">
                <div class="col-12 col-md-10 col-lg-12">
                  <div class="d-flex align-items-center border rounded-3 text-center p-3 h-80">
                    <img (click)="showcaseImageClick()" *ngIf="showCaseImagePath" [defaultImage]="defaultImage" [lazyLoad]="showCaseImagePath" type="button" class="showcaseImage w-100 rounded-3" style="height: 45vh; object-fit: contain;" />
                    <img *ngIf="!showCaseImagePath" src="/assets/product.jpg" class="showcaseImage w-100 rounded-3" style="height: 45vh; object-fit: contain;" />
                  </div>
                  <div class="mt-2 col-12 d-flex justify-content-center">
                    <ng-image-slider *ngIf="imageObject.length > 0" class="imageSlider" [imagePopup]="true" [slideImage]="2" [lazyLoading]="false" [animationSpeed]="0.4" [imageSize]="{ width: '75', height: '70', space: 2 }" style="height: 70px; width: 300px;" [images]="imageObject" #imageSlider></ng-image-slider>
                  </div>
                </div>
              </div>
            </div>
            <div class="product-right col-12 col-lg-6 pt-2">
              <div *ngIf="product.stock <= 0">
                <div class="alert alert-danger">We're sorry, the product you're looking for is currently out of stock. If you'd like to check if it will be available in the near future, please follow us</div>
              </div>
              <div class="product-name d-flex">
                <h1 class="fs-2 mb-3">{{ product ? product.name : '' }}</h1>
              </div>
              <!-- ratings -->
              <div class="mb-5 d-flex align-items-center">
                <div *ngIf="product.totalRatingNumber > 0" class="d-flex">
                  <!-- <fa-icon style="color: #ffa41c;" *ngFor="let icon of getStarIcons(5)" [icon]="icon"></fa-icon> -->
                  <p-rating [(ngModel)]="product.averageStar" [readonly]="true" [cancel]="false" style="pointer-events: none; position: relative;"></p-rating>
                  <span *ngIf="product.totalRatingNumber > 0" class="ms-1">{{ product.averageStar + '/5' }}</span>
                  <a *ngIf="product.totalRatingNumber > 0" (click)="goToRatings()" type="button" class="ms-3 text-decoration-none user-select-none">View Reviews ({{ product.totalRatingNumber }})</a>
                </div>
              </div>
              <h1 class="fs-3 mb-4">{{ product ? (product.price | currency : 'USD') : '' }}</h1>
              <div *ngIf="product.stock > 0" class="d-flex align-items-center">
                <!-- sepet adet -->
                <div class="col-3 py-2 d-flex align-items-center me-2" style="width: fit-content;">
                  <fa-icon (click)="minusQuantity()" class="me-1" style="font-size: 18px; cursor: pointer;" [icon]="faMinus"></fa-icon>
                  <input [disabled]="product.stock <= 0" readonly min="1" max="100" [(ngModel)]="productQuantity" type="number" class="form-control me-1" style="box-shadow: none; width: 60px; height: 40px;" />
                  <fa-icon (click)="plusQuantity()" class="me-1" style="font-size: 18px;cursor: pointer;" [icon]="faPlus"></fa-icon>
                </div>
                <button [disabled]="product.stock <= 0" (click)="addToBasket()" class="btn btn-primary btn-lg">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="section" class="container-sm">
        <!-- height sonra sil -->
        <div class="border rounded-3">
          <div class="nav d-flex justify-content-center mb-3">
            <!-- nav-link classı varsa mavi oluyor -->
            <div id="descriptionButton" (click)="descriptionButtonClicked()" role="button" class="item nav-link border-bottom border-start rounded-start-2 p-2">
              <h2 style="font-size: 17px; font-weight: 500;" class="m-0 user-select-none">Product Information</h2>
            </div>
            <div id="ratingButton" (click)="ratingButtonClicked()" role="button" class="item border-bottom border-start border-end rounded-end-2 p-2">
              <h2 style="font-size: 17px; font-weight: 500;" class="m-0 user-select-none">Reviews</h2>
            </div>
          </div>
          <!-- description -->
          <div id="description" class="px-2">
            <div [innerHTML]="product.description"></div>
          </div>
          <!-- rating -->
          <div id="rating" class="px-2 d-none">
            <div *ngIf="ratingComponentLoaded">
              <!-- ProductDetailComponent yüklendiğinde ratings de yüklenmesin diye lazy loading gibi  -->
              <app-product-rating></app-product-rating>
            </div>
          </div>
        </div>
      </section>

      <!-- product ile ilgili her şeyin sonu alttaki div -->
    </div>
    <div *ngIf="productNotFound && !isLoading" class="container mt-5 w-50">
      <div class="alert alert-info ">Böyle bir ürün yok.</div>
      <button routerLink="/search" class="btn btn-success mt-2">Alışverişe devam edin</button>
    </div>
  `,
  styles: [
    `
      @media only screen and (max-width: 450px) {
        /* .showcaseImage {
          height: 30vh !important;
        } */
        .imageSlider {
          width: 200px !important;
        }
      }
      /* number inputlardan arrow kaldırma */
      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      .nav-link {
        background-color: #016a70;
        color: white;
      }
      ::ng-deep .p-rating-icon:not(.p-rating-cancel) {
        color: #ffa41c !important;
      }
      /* starlar arası margin */
      ::ng-deep .p-rating {
        gap: 2px;
      }
      .product-name {
        font-weight: 500 !important;
        -webkit-line-clamp: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class ProductDetailComponent implements OnInit {
  //
  faPlus = faPlus;
  faMinus = faMinus;
  faStar = faStar;
  urlId = '';
  isLoading = true;
  productQuantity = 1;
  productNotFound: boolean;
  photoLinks: string[] = [];
  showCaseImagePath: string;
  defaultImage = '/assets/preload.png';
  baseUrl: string;
  imageObject: Array<PhotoSliderObject> = [];
  ratingComponentLoaded = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private productService: ProductService, private sanitizer: DomSanitizer, private basketService: BasketService, private toastr: ToastrService, private fileService: FileService, private spinner: NgxSpinnerService, private authService: AuthService, private ratingService: ProuductRatingService) {
    this.urlId = router.url.split('/')[2];
  }

  product: List_Product_Detail | undefined = {
    name: '',
    id: '',
    stock: 0,
    price: 0,
    description: undefined,
    createdDate: undefined,
    url: '',
    updatedDate: undefined,
    productImageFiles: [],
    averageStar: 0,
    totalRatingNumber: 0,
  };

  async ngOnInit() {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);

    this.baseUrl = (await this.fileService.getBaseStorageUrl()).url;
    this.isLoading = true;

    try {
      const fetchedProduct = await this.productService.getProductByUrlId(this.urlId);
      if (fetchedProduct) {
        this.product = fetchedProduct;

        for (const item of this.product.productImageFiles) {
          if (item.showcase == true) this.showCaseImagePath = `${this.baseUrl}/${item.path}`;

          const photoSliderObject: PhotoSliderObject = {
            image: `${this.baseUrl}/${item.path}`,
            thumbImage: `${this.baseUrl}/${item.path}`,
            showcase: item.showcase,
          };
          this.imageObject.push(photoSliderObject);
        }

        this.imageObject.sort((a, b) => {
          //imageObject true olan resim en başta olacak şekilde sıralama
          if (a.showcase && !b.showcase) {
            return -1; // a showcase ise, b değilse a önce gelir
          } else if (!a.showcase && b.showcase) {
            return 1; // b showcase ise, a değilse b önce gelir
          } else {
            return 0; // Her ikisi de aynı, sıralamada değişiklik yapma
          }
        });

        this.sanitizer.bypassSecurityTrustHtml(this.product.description as string);
      } else {
        //
      }
    } catch (error) {
      this.productNotFound = true;
      this.toastr.clear();
    }

    setTimeout(() => {
      if (this.imageObject.length > 0) this.slider.prev();
    }, 100);
    this.isLoading = false;
    this.spinner.hide();
  }
  plusQuantity() {
    this.productQuantity++;
  }
  minusQuantity() {
    if (this.productQuantity != 1) this.productQuantity--;
  }
  // getStarIcons(starCount: number): any[] {
  //   const filledStar = faStar;

  //   const icons = [];
  //   for (let i = 0; i < starCount; i++) {
  //     if (i < starCount) icons.push(filledStar);
  //   }

  //   return icons;
  // }
  addToBasket() {
    if (this.authService.isAuthenticated) {
      const basketItem: Create_Basket_Item = new Create_Basket_Item();
      basketItem.basketId = this.basketService.getBasketId();
      basketItem.productId = this.product.id;
      basketItem.quantity = this.productQuantity;

      this.basketService
        .add(basketItem)
        .then((response: Error_DTO) => {
          if (response.succeeded == false) {
            this.toastr.error(response.message);
          } else {
            this.toastr.success('Ürün Başarıyla Sepete eklendi');
          }
        })
        .catch(() => {
          this.spinner.hide();
        });
    } else this.toastr.info('Bu işlemi yapmak için giriş yapmalısınız', 'Hata');
  }

  descriptionButtonClicked() {
    if (typeof document !== 'undefined') {
      const descriptionButton = document.getElementById('descriptionButton');
      const ratingButton = document.getElementById('ratingButton');
      const ratingSection = document.getElementById('rating');
      const descriptionSection = document.getElementById('description');

      if (!descriptionButton.classList.contains('nav-link')) {
        descriptionButton.classList.add('nav-link');

        descriptionSection.classList.remove('d-none');
        ratingSection.classList.add('d-none');
        ratingButton.classList.remove('nav-link');
      }
    }
  }
  ratingButtonClicked() {
    if (typeof document !== 'undefined') {
      const descriptionButton = document.getElementById('descriptionButton');
      const ratingButton = document.getElementById('ratingButton');
      const ratingSection = document.getElementById('rating');
      const descriptionSection = document.getElementById('description');

      if (!ratingButton.classList.contains('nav-link')) {
        ratingButton.classList.add('nav-link');

        ratingSection.classList.remove('d-none');
        descriptionSection.classList.add('d-none');
        descriptionButton.classList.remove('nav-link');
      }
      this.ratingComponentLoaded = true;
    }
  }

  goToRatings() {
    if (typeof document !== 'undefined') {
      const ratingButton = document.getElementById('ratingButton');
      const ratingSection = document.getElementById('rating');
      const section = document.getElementById('section');
      const descriptionButton = document.getElementById('descriptionButton');
      const descriptionSection = document.getElementById('description');

      descriptionButton.classList.remove('nav-link');
      descriptionSection.classList.add('d-none');
      ratingButton.classList.add('nav-link');
      ratingSection.classList.remove('d-none');
      section.scrollIntoView();
      this.ratingComponentLoaded = true;
    }
  }

  //image slider
  @ViewChild('imageSlider') slider: NgImageSliderComponent;

  showcaseImageClick() {
    this.slider.imageOnClick(0);
  }

  //rating
}
