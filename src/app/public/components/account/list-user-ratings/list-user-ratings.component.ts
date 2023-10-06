import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ListUserRatings } from 'src/app/contracts/productRating/listUserRatings/list_user_ratings';
import { FileService } from 'src/app/services/models/file.service';
import { ProductService } from 'src/app/services/models/product.service';
import { ProuductRatingService } from 'src/app/services/models/prouduct-rating.service';

@Component({
  selector: 'app-list-user-ratings',
  template: `
    <div *ngIf="ratings.ratings" class="p-0 p-md-3">
      <h2>Your Ratings</h2>

      <div>
        <div *ngFor="let rating of ratings.ratings" class="border-bottom mt-3 card p-1 p-md-2">
          <div role="button" class="d-flex align-items-center mb-2" routerLink="/product/{{ rating.productUrlId }}" style="width: fit-content;">
            <img *ngIf="rating.productShowcaseImageUrl" src="{{ rating.productShowcaseImageUrl }}" class="rounded-2" style="width: 80px; height: 80px; object-fit: cover;" />

            <img *ngIf="!rating.productShowcaseImageUrl" src="/assets/product.jpg" class="rounded-2" style="width: 80px; height: 80px; object-fit: cover;" />

            <p class="p-0 m-0 ms-1">{{ rating.productName }}</p>
          </div>
          <div>
            <p-rating class="d-block" [(ngModel)]="rating.star" [readonly]="true" [cancel]="false" style="pointer-events: none; width: 20px; padding: 0;"></p-rating>
          </div>
          <p>{{ getRelativeDate(rating.createdDate) }}</p>
          <p>
            {{ rating.comment }}
          </p>
        </div>
      </div>
    </div>
    <div *ngIf="!ratings.ratings && isLoaded" class="alert alert-danger">You don't have any reviews.</div>
  `,
  styles: [
    `
      ::ng-deep .p-rating-icon:not(.p-rating-cancel) {
        color: #ffa41c !important;
      }

      *:focus {
        box-shadow: none !important;
      }
      ::ng-deep .p-rating {
        gap: 3px;
      }
      .product-name {
        font-weight: 500 !important;
        -webkit-line-clamp: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .inputError {
        color: chocolate;
        font-size: 12px;
      }
    `,
  ],
})
export class ListUserRatingsComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService, private toastr: ToastrService, private productRatingService: ProuductRatingService, private productService: ProductService, private fileService: FileService) {}

  ratings: ListUserRatings = {
    ratings: [],
    totaluserRatingCount: 0,
  };
  baseUrl: string;
  isLoaded = false;

  async ngOnInit() {
    this.baseUrl = (await this.fileService.getBaseStorageUrl()).url;
    await this.getRatings();
    this.isLoaded = true;
  }

  async getRatings() {
    const userRatings = await this.productRatingService.getUserRatings('');
    this.ratings = {
      ratings: userRatings.ratings.map((rating) => {
        if (rating.productShowcaseImageUrl) {
          rating.productShowcaseImageUrl = `${this.baseUrl}/${rating.productShowcaseImageUrl}`;
        }
        return rating;
      }),
      totaluserRatingCount: userRatings.totaluserRatingCount,
    };
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
