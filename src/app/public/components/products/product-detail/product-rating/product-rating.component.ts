import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { List_Product_Detail } from 'src/app/contracts/product/lis_product_detail';
import { CreateRating } from 'src/app/contracts/productRating/create_rating';
import { GetProductRatings } from 'src/app/contracts/productRating/get_product_ratings';
import { ListProductRatings } from 'src/app/contracts/productRating/listProductRatings/list_product_ratings';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { ProductService } from 'src/app/services/models/product.service';
import { ProuductRatingService } from 'src/app/services/models/prouduct-rating.service';
import { faSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-product-rating',
  template: `
    <div *ngIf="bootstrapSpinner" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>

    <div class="pb-3 border-bottom">
      <h1 class="product-name"><span class="fs-5">Reviews of </span>{{ product.name }}</h1>
      <button (click)="openRatingModel()" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#ratingModal">Write a customer review</button>
    </div>

    <div *ngIf="!bootstrapSpinner">
      <!-- filters -->
      <div class="d-flex py-4 ps-2 border-bottom align-items-center">
        <div class="dropdown me-3" style="width: fit-content;">
          <div class="dropdown-toggle user-select-none border" type="button" data-bs-toggle="dropdown" style="height: 40px; padding: 8px;border-radius: 5px; ">Sort By</div>
          <ul class="dropdown-menu dropstart">
            <li (click)="sortNewDate()" type="button" class="dropdown-item">New Ratings</li>
            <li (click)="sortOldDate()" type="button" class="dropdown-item">Old Ratings</li>
            <li (click)="sortBest()" type="button" class="dropdown-item">Positive Ratings</li>
            <li (click)="sortWorst()" type="button" class="dropdown-item">Negative Ratings</li>
          </ul>
        </div>
        <form class="d-flex" style="height: 40px">
          <input [(ngModel)]="productRatingsFilter.keyword" (input)="onInputKeyup()" name="onemsiz" class="form-control me-2 " placeholder="Search in Reviews" />
          <!-- <button type="button" class="btn btn-warning"><fa-icon class="fs-5 me-1" [icon]="faMagnifyingGlass"></fa-icon></button> -->
        </form>
      </div>
      <!-- ratings -->
      <div>
        <p class="m-0 p-0 mt-2 fw-bold">{{ productRatings.totalProductRatingCount }} Ratings</p>

        <div class="p-3" *ngIf="productRatings.ratings">
          <div *ngFor="let rating of productRatings.ratings" class="border-bottom mt-3">
            <div class="d-flex align-items-center mb-1">
              <fa-icon class="fs-5 me-2" [icon]="faUser"></fa-icon>
              <h3 class="m-0 p-0">{{ rating.userName }}</h3>
            </div>
            <p-rating class="d-block" [(ngModel)]="rating.star" [readonly]="true" [cancel]="false" style="pointer-events: none; width: 40px;"></p-rating>
            <p>{{ getRelativeDate(rating.createdDate) }}</p>
            <p>
              {{ rating.comment }}
            </p>
          </div>
        </div>
        <!-- pagination -->
        <nav *ngIf="totalPageCount > 1 && !bootstrapSpinner" class="my-2 user-select-none" aria-label="Page navigation example">
          <ul class="pagination pagination justify-content-center m-0 mb-1">
            <li (click)="firstPage()" type="button" class="page-item page-link"><<</li>
            <li (click)="previousPage()" type="button" class="page-item page-link"><</li>
            <li (click)="nextPage()" type="button" class="page-item page-link">></li>
            <li (click)="lastPage()" type="button" class="page-item page-link">>></li>
          </ul>
          <div class="m-0 me-2 d-flex justify-content-center">{{ productRatingsFilter.page + 1 }} - {{ totalPageCount }}</div>
        </nav>
      </div>
    </div>

    <div *ngIf="productRatings.ratings.length < 1 && !bootstrapSpinner" class="mt-2 d-flex justify-content-center">
      <div class="alert alert-warning" style="width: fit-content;">There are no reviews available for this product.</div>
    </div>

    <!-- <div *ngIf="bootstrapSpinner" style="margin-bottom: 600px;"></div> -->

    <!-- rating model -->

    <div class="modal fade" id="ratingModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Rate {{ product.name }}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div *ngIf="ratingStatus" class="modal-body">
            <div *ngIf="ratingStatus.state === 'NotBuyed'" class="alert alert-warning" role="alert">You must have purchased the product to leave a review.</div>
            <div *ngIf="ratingStatus.state === 'noLogin'" class="alert alert-warning" role="alert">You must be login to perform this action.</div>
            <div *ngIf="ratingStatus.state === 'BuyedAndHasRating'" class="alert alert-warning" role="alert">You have previously made a review on the product. You can access your comments in the 'Account' section.</div>

            <div *ngIf="ratingStatus.state === 'BuyedAndNotRating'">
              <form [formGroup]="frm" class="">
                <!-- star -->

                <div class="mb-3 d-flex flex-column align-items-center">
                  <label for="star" class="form-label">Star</label>
                  <p-rating class="d-block" formControlName="star" [cancel]="false"></p-rating>
                  <div *ngIf="submitted">
                    <div *ngIf="star.hasError('required')" class="inputError">Star is required</div>
                    <div *ngIf="star.hasError('max')" class="inputError">Star must be less than 6</div>
                    <div *ngIf="star.hasError('min')" class="inputError">Star must be more than 0</div>
                  </div>
                </div>

                <div class="mb-3 d-flex flex-column align-items-center">
                  <label for="comment" class="form-label">Comment</label>
                  <textarea maxlength="800" rows="5" type="text" id="comment" class="form-control" formControlName="comment"></textarea>
                  <div *ngIf="submitted">
                    <div *ngIf="comment.hasError('required')" class="inputError">Comment is required</div>
                    <div *ngIf="comment?.hasError('maxLength')" class="inputError">Comment must be less than 400 characters</div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="modal-footer">
            <button [disabled]="isSend" *ngIf="ratingStatus.state === 'BuyedAndNotRating'" (click)="rateProduct()" type="button" class="btn btn-danger">Yorum Yap</button>
            <button type="button" class="btn btn-secondary" id="closeModal" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* star rengi sarı yapma */
      ::ng-deep .p-rating-icon:not(.p-rating-cancel) {
        color: #ffa41c !important;
      }
      *:focus {
        box-shadow: none !important;
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
export class ProductRatingComponent implements OnInit {
  frm: FormGroup;
  submitted = false;
  isSend = false;

  urlId: string;
  faUser = faUser;
  bootstrapSpinner = true;
  private inputChangeSubject = new Subject<string>();
  searchInputDelayTime = 300;

  constructor(private ratingService: ProuductRatingService, private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private productService: ProductService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    activatedRoute.params.subscribe((params) => {
      this.urlId = params['urlId'];
    });

    this.frm = this.formBuilder.group({
      star: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.maxLength(800)]],
    });

    this.inputChangeSubject.pipe(debounceTime(this.searchInputDelayTime)).subscribe(() => {
      //search inputu gecikmeli arama
      this.onSearchInputChange();
    });
  }
  product: List_Product_Detail = {
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
  productRatings: ListProductRatings = {
    totalProductRatingCount: 0,
    ratings: [],
  };
  productRatingsFilter: GetProductRatings = {
    page: 0,
    size: 12,
    productId: this.product.id,
    keyword: '',
  };
  ratingStatus: { state: string } = {
    state: '',
  }; //apiden obje böyle geliyor
  totalPageCount: number;

  async ngOnInit() {
    this.bootstrapSpinner = true;

    this.product = await this.productService.getProductByUrlId(this.urlId);

    if (this.authService.isAuthenticated) {
      const queryString = `productId=${this.product.id}&userId=${this.authService.UserId}`;
      this.ratingStatus = await this.ratingService.isProductReviewPending(queryString);
    } else {
      this.ratingStatus.state = 'noLogin';
    }

    this.getProductRatings();
  }

  async openRatingModel() {}

  rateProduct() {
    this.submitted = true;
    if (this.frm.invalid) return;

    this.spinner.show();

    const model: CreateRating = {
      comment: this.comment.value,
      star: this.star.value,
      productId: this.product.id,
      userId: this.authService.UserId,
    };

    this.ratingService
      .createRating(model)
      .then(() => {
        this.toastr.success('Success');
        this.isSend = true;
      })
      .catch((err) => {
        this.toastr.error(err.error);
      })
      .finally(() => this.spinner.hide());
  }

  async getProductRatings() {
    this.productRatings = await this.ratingService.getProductRatings(this.queryStringBuilder()).finally(() => {
      this.bootstrapSpinner = false;
      this.spinner.hide();
    });

    this.totalPageCount = Math.ceil(this.productRatings.totalProductRatingCount / this.productRatingsFilter.size);
  }

  queryStringBuilder(): string {
    let queryString = `size=${this.productRatingsFilter.size}`;

    if (this.productRatingsFilter.page) queryString += `&page=${this.productRatingsFilter.page}`;

    if (this.product) queryString += `&ProductId=${this.product.id}`;

    if (this.productRatingsFilter.sortType) queryString += `&sortType=${this.productRatingsFilter.sortType}`;

    if (this.productRatingsFilter.keyword) queryString += `&keyword=${this.productRatingsFilter.keyword}`;

    return queryString;
  }

  async previousPage() {
    if (this.productRatingsFilter.page > 0) {
      this.productRatingsFilter.page--;
      await this.getProductRatings();
    }
  }
  async nextPage() {
    if (this.productRatingsFilter.page != this.totalPageCount - 1) {
      this.productRatingsFilter.page++;
      await this.getProductRatings();
    }
  }
  firstPage() {
    if (this.productRatingsFilter.page != 0) {
      this.productRatingsFilter.page = 0;
      this.getProductRatings();
    }
  }
  lastPage() {
    if (this.productRatingsFilter.page != this.totalPageCount - 1) {
      this.productRatingsFilter.page = this.totalPageCount - 1;
      this.getProductRatings();
    }
  }

  sortNewDate() {
    this.productRatingsFilter.sortType = 'newDate';
    this.productRatingsFilter.page = 0;
    this.getProductRatings();
  }
  sortOldDate() {
    this.productRatingsFilter.sortType = 'oldDate';
    this.productRatingsFilter.page = 0;
    this.getProductRatings();
  }
  sortBest() {
    this.productRatingsFilter.sortType = 'best';
    this.productRatingsFilter.page = 0;
    this.getProductRatings();
  }
  sortWorst() {
    this.productRatingsFilter.sortType = 'worst';
    this.productRatingsFilter.page = 0;
    this.getProductRatings();
  }

  onInputKeyup() {
    // Ancak debounceTime ile 300 ms gecikmeli olarak onSearchInputChange'e olay gönderir.
    this.inputChangeSubject.next(this.productRatingsFilter.keyword);
  }

  onSearchInputChange() {
    this.getProductRatings();
  }

  ////////////////
  get star() {
    return this.frm.get('star');
  }
  get comment() {
    return this.frm.get('comment');
  }

  formatDate(dateString: string): string {
    // date daha güzel görünür

    const date = new Date(dateString);
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  getRelativeDate(commentDateString: string): string {
    const commentDate = new Date(commentDateString);
    const today = new Date();
    const commentDay = commentDate.getDate();
    const commentMonth = commentDate.getMonth();
    const commentYear = commentDate.getFullYear();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    if (commentDay === todayDay && commentMonth === todayMonth && commentYear === todayYear) {
      return 'Reviewed today';
    } else if (commentDay === todayDay - 1 && commentMonth === todayMonth && commentYear === todayYear) {
      return 'Reviewed yesterday';
    } else {
      const diffTime = Math.abs(today.getTime() - commentDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 10) {
        return `${diffDays} days ago reviewed`;
      } else {
        return 'Reviewed on ' + this.formatDate(commentDateString);
      }
    }
  }
}
