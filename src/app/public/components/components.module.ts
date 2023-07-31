import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products/products.module';
import { BasketModule } from './basket/basket.module';
import { HomeModule } from './home/home.module';
import { AuthModule } from './auth/auth.module';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, ProductsModule, BasketModule, HomeModule, AuthModule],
})
export class ComponentsModule {}
