import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ProductListComponent } from './product-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProductListComponent],
  imports: [CommonModule, FormsModule, RatingModule, LazyLoadImageModule, RouterModule.forChild([{ path: '', component: ProductListComponent }])],
})
export class ProductListModule {}
