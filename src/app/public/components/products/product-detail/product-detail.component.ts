import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-product-detail',
  template: `
    <!-- sayfa yenilemeden routing yaparken footer gözükmsein diye önlem -->
    <div *ngIf="isLoading" style="height: 100vh;"></div>
    <!-- all component -->
    <div *ngIf="!productNotFound && !isLoading">
      <section *ngIf="product && !isLoading" class="py-0 mt-3">
        <div class="container-sm">
          <nav class="mb-3">Elektronik > Telefon > {{ product ? product.name : '' }}</nav>
          <div class="row mb-5 mb-lg-8">
            <div class="col-12 col-lg-6">
              <div class="row mb-3 d-flex justify-content-center">
                <div class="col-12 col-md-10 col-lg-12">
                  <div class="d-flex align-items-center border rounded-3 text-center p-3 h-80">
                    <img [lazyLoad]="photoLinks[0]" class="showcaseImage w-100 rounded-3" style="height: 45vh; object-fit: contain;" />
                  </div>
                  <div class="mt-2 col-12 d-flex justify-content-center">
                    <ng-image-slider class="imageSlider" [slideImage]="2" [lazyLoading]="true" [animationSpeed]="0.4" [imageSize]="{ width: '75', height: '70', space: 2 }" style="height: 70px; width: 300px;" [images]="imageObject" #nav></ng-image-slider>
                  </div>
                </div>
              </div>
            </div>
            <div class="product-right col-12 col-lg-6 pt-2">
              <h1 class="fs-2 mb-3">{{ product ? product.name : '' }}</h1>
              <!-- ratings -->
              <div class="mb-5 d-flex align-items-center">
                <div>
                  <fa-icon style="color: #ffa41c;" *ngFor="let icon of getStarIcons(5)" [icon]="icon"></fa-icon>
                </div>
                <a (click)="goToRatings()" type="button" class="ms-3 text-decoration-none user-select-none">Yorumları Gör (67)</a>
              </div>
              <h1 class="fs-3 mb-4">{{ product ? product.price : '' }} TL</h1>
              <div class="d-flex align-items-center">
                <!-- sepet adet -->
                <div class="col-3 py-2 d-flex align-items-center me-2" style="width: fit-content;">
                  <fa-icon (click)="minusQuantity()" class="me-1" style="font-size: 18px; cursor: pointer;" [icon]="faMinus"></fa-icon>
                  <input readonly min="1" max="100" [(ngModel)]="productQuantity" type="number" class="form-control me-1" style="box-shadow: none; width: 60px; height: 40px;" />
                  <fa-icon (click)="plusQuantity()" class="me-1" style="font-size: 18px;cursor: pointer;" [icon]="faPlus"></fa-icon>
                </div>
                <button (click)="addToBasket()" class="btn btn-primary btn-lg">Sepete Ekle</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="section" class="container-sm">
        <!-- height sonra sil -->
        <div class="border rounded-3" style="height: 300px;">
          <div class="nav d-flex justify-content-center mb-3">
            <!-- nav-link classı varsa mavi oluyor -->
            <div id="descriptionButton" (click)="descriptionButtonClicked()" role="button" class="item nav-link border-bottom border-start rounded-start-2 p-2">
              <h2 style="font-size: 17px; font-weight: 500;" class="m-0 user-select-none">Ürün Bilgileri</h2>
            </div>
            <div id="ratingButton" (click)="ratingButtonClicked()" role="button" class="item border-bottom border-start border-end rounded-end-2 p-2">
              <h2 style="font-size: 17px; font-weight: 500;" class="m-0 user-select-none">Yorumlar</h2>
            </div>
          </div>
          <div href="#description" id="description" class="px-2">
            <div [innerHTML]="product.description"></div>
          </div>
          <div id="rating" class="px-2 d-none">
            <div>Ratings</div>
          </div>
        </div>
      </section>

      <!-- product ile ilgili her şeyin sonu -->
    </div>
    <div *ngIf="productNotFound && !isLoading" class="container mt-5 w-50">
      <div class="alert alert-info ">Böyle bir ürün yok.</div>
      <button routerLink="/search" class="btn btn-success mt-2">Alışverişe devam edin</button>
    </div>
    <!-- <img [lazyLoad]="photoLinks[1]" class="w-25 rounded-3" style="height: 45vh; object-fit: contain;" /> -->
    <!--  -->
  `,
  styles: [
    `
      @media only screen and (max-width: 450px) {
        .showcaseImage {
          height: 30vh !important;
        }
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
    `,
  ],
})
export class ProductDetailComponent implements OnInit {
  //
  faPlus = faPlus;
  faMinus = faMinus;
  faStar = faStar;
  urlId: string = '';
  isLoading: boolean = true;
  productQuantity: number = 1;
  photoLinks: any;
  productNotFound: boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private productService: ProductService, private sanitizer: DomSanitizer, private basketService: BasketService, private toastr: ToastrService) {
    this.urlId = router.url.split('/')[2];
    this.photoLinks = ['/assets/product.jpg', '/assets/product2.jpg'];
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
  };

  async ngOnInit() {
    this.isLoading = true;

    try {
      const fetchedProduct = await this.productService.getProductByUrlId(this.urlId);
      if (fetchedProduct) {
        this.product = fetchedProduct;
        this.sanitizer.bypassSecurityTrustHtml(this.product.description as string);
      } else {
        //
      }
    } catch (error) {
      this.productNotFound = true;
      this.toastr.clear();
    }

    this.isLoading = false;
  }
  plusQuantity() {
    this.productQuantity++;
  }
  minusQuantity() {
    if (this.productQuantity != 1) this.productQuantity--;
  }
  getStarIcons(starCount: number): any[] {
    const filledStar = faStar;

    const icons = [];
    for (let i = 0; i < starCount; i++) {
      if (i < starCount) icons.push(filledStar);
    }

    return icons;
  }
  addToBasket() {
    let basketItem: Create_Basket_Item = new Create_Basket_Item();
    basketItem.basketId = this.basketService.getBasketId();
    basketItem.productId = this.product.id;
    basketItem.quantity = this.productQuantity;

    this.basketService.add(basketItem).then(() => {
      this.toastr.success('Ürün Başarıyla Sepete eklendi');
    });
  }

  descriptionButtonClicked() {
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
  ratingButtonClicked() {
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
  }

  goToRatings() {
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
  }
  // active rengi rgb(110, 168, 254)
  imageObject: Array<object> = [
    {
      image: '/assets/product.jpg',
      thumbImage: '/assets/product.jpg',
    },
    {
      video: 'https://youtu.be/6pxRHBw-k8M',
    },
    {
      image: '/assets/product.jpg',
      thumbImage: '/assets/product.jpg',
    },
    {
      image: '/assets/product.jpg',
      thumbImage: '/assets/product.jpg',
    },
    {
      image: '/assets/product.jpg',
      thumbImage: '/assets/product.jpg',
    },
  ];
}
