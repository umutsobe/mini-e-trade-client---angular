import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from './product-detail.component';
import { RouterModule } from '@angular/router';
import { NgImageSliderModule } from 'ng-image-slider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [ProductDetailComponent],
  imports: [CommonModule, LazyLoadImageModule, NgImageSliderModule, FormsModule, FontAwesomeModule, RouterModule.forChild([{ path: '', component: ProductDetailComponent }])],
})
export class ProductDetailModule {}
