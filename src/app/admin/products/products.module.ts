import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateModule } from './create/create.module';
import { ListModule } from './list/list.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, CreateModule, ListModule],
})
export class ProductsModule {}
