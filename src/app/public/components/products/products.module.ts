import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductsComponent, ProductListComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ProductsComponent }]), FormsModule],
})
export class ProductsModule {}
