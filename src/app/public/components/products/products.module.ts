import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RatingModule } from 'primeng/rating';

@NgModule({
  declarations: [ProductsComponent, ProductListComponent],
  imports: [CommonModule, LazyLoadImageModule, RouterModule.forChild([{ path: '', component: ProductsComponent }]), FormsModule, RatingModule],
})
export class ProductsModule {}
