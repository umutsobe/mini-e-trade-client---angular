import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FileUploadModule } from 'src/app/services/common/file-upload/file-upload.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ListComponent }]), MatFormFieldModule, MatDialogModule, MatTableModule, MatPaginatorModule, FileUploadModule, NgxSpinnerModule, MatListModule],
  exports: [ListComponent],
})
export class ListModule {}
