import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageControlComponent } from './images-control.component';
import { RouterModule } from '@angular/router';
import { FileUploadModule } from 'src/app/services/common/file-upload/file-upload.module';
import { ImageModule } from 'primeng/image';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [ImageControlComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ImageControlComponent }]), FileUploadModule, ImageModule, DragDropModule],
})
export class ImageControlModule {}
