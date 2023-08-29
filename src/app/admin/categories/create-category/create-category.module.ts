import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCategoryComponent } from './create-category.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [CreateCategoryComponent],
  imports: [CommonModule, ReactiveFormsModule, NgxSpinnerModule],
  exports: [CreateCategoryComponent],
})
export class CreateCategoryModule {}
