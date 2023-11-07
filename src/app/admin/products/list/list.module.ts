import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { RouterModule } from '@angular/router';
import { FileUploadModule } from 'src/app/services/common/file-upload/file-upload.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatListModule } from '@angular/material/list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { UpdateProductModalModule } from '../modals/update-product-modal/update-product-modal.module';
import { ProductPhotoModalModule } from '../modals/product-photo-modal/product-photo-modal.module';
import { ProductDeleteModalModule } from '../modals/product-delete-modal/product-delete-modal.module';
import { ProductCategoryModalModule } from '../modals/product-category-modal/product-category-modal.module';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ListComponent }]), FileUploadModule, NgxSpinnerModule, MatListModule, FormsModule, FontAwesomeModule, UpdateProductModalModule, ProductPhotoModalModule, ProductDeleteModalModule, ProductCategoryModalModule],
  exports: [ListComponent],
})
export class ListModule {}
