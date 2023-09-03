import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { RouterModule } from '@angular/router';
import { FileUploadModule } from 'src/app/services/common/file-upload/file-upload.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatListModule } from '@angular/material/list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ListComponent }]), FileUploadModule, NgxSpinnerModule, MatListModule, FormsModule, FontAwesomeModule],
  exports: [ListComponent],
})
export class ListModule {}
