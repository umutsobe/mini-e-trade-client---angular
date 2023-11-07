import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPhotoModalComponent } from './product-photo-modal.component';
import { FileUploadModule } from 'src/app/services/common/file-upload/file-upload.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [ProductPhotoModalComponent],
  imports: [CommonModule, FileUploadModule, NgxSpinnerModule],
  exports: [ProductPhotoModalComponent],
})
export class ProductPhotoModalModule {}
