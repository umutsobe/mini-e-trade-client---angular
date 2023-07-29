import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateModule } from './create/create.module';
import { ListModule } from './list/list.module';
import { ProductsComponent } from './products.component';
@NgModule({
  declarations: [ProductsComponent],
  imports: [CommonModule, RouterModule, CreateModule, ListModule, RouterModule.forChild([{ path: '', component: ProductsComponent }])],
})
export class ProductsModule {}
