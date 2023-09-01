import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateModule } from './create/create.module';
import { ListModule } from './list/list.module';
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule, CreateModule, ListModule],
})
export class ProductsModule {}
