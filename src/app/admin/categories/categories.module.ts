import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CreateCategoryModule } from './create-category/create-category.module';
import { ListCategoryModule } from './list-category/list-category.module';

@NgModule({
  declarations: [CategoriesComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: CategoriesComponent }]), NgxSpinnerModule, CreateCategoryModule, ListCategoryModule],
})
export class CategoriesModule {}
