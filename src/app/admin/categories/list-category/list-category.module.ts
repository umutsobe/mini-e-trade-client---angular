import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCategoryComponent } from './list-category.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ListCategoryComponent],
  imports: [CommonModule, MatDialogModule, MatPaginatorModule, NgxSpinnerModule],
  exports: [ListCategoryComponent],
})
export class ListCategoryModule {}
