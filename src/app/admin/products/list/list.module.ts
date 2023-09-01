import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { RouterModule } from '@angular/router';
import { FileUploadModule } from 'src/app/services/common/file-upload/file-upload.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ListComponent }]), FileUploadModule, NgxSpinnerModule, MatListModule],
  exports: [ListComponent],
})
export class ListModule {}
