import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FileUploadModule } from '../../services/common/file-upload/file-upload.module';
@NgModule({
  declarations: [ProductsComponent, CreateComponent, ListComponent],
  imports: [MatFormFieldModule, MatDialogModule, MatTableModule, MatPaginatorModule, ReactiveFormsModule, NgxSpinnerModule, CommonModule, RouterModule.forChild([{ path: '', component: ProductsComponent }]), FileUploadModule],
})
export class ProductsModule {}
