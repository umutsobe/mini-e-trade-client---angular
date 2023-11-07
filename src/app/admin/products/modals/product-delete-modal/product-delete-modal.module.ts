import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDeleteModalComponent } from './product-delete-modal.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [ProductDeleteModalComponent],
  imports: [CommonModule, NgxSpinnerModule],
  exports: [ProductDeleteModalComponent],
})
export class ProductDeleteModalModule {}
