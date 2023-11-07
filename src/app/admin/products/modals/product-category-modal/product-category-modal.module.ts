import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategoryModalComponent } from './product-category-modal.component';
import { MatListModule } from '@angular/material/list';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [ProductCategoryModalComponent],
  imports: [CommonModule, MatListModule, NgxSpinnerModule],
  exports: [ProductCategoryModalComponent],
})
export class ProductCategoryModalModule {}
