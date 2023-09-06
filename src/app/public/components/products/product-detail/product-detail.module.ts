import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from './product-detail.component';
import { RouterModule } from '@angular/router';
import { NgImageSliderModule } from 'ng-image-slider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductRatingComponent } from './product-rating/product-rating.component';
import { RatingModule } from 'primeng/rating';

@NgModule({
  declarations: [ProductDetailComponent, ProductRatingComponent],
  imports: [CommonModule, LazyLoadImageModule, NgImageSliderModule, FormsModule, FontAwesomeModule, RouterModule.forChild([{ path: '', component: ProductDetailComponent }]), NgxSpinnerModule, RatingModule, ReactiveFormsModule],
})
export class ProductDetailModule {}
