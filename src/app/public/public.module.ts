import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './components/products/products.module';
import { AuthModule } from './components/auth/auth.module';
import { HomeModule } from './components/home/home.module';
import { BasketModule } from './components/basket/basket.module';
import { AccountModule } from './components/account/account.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, CommonModule, ProductsModule, BasketModule, HomeModule, AuthModule, AccountModule],
})
export class PublicModule {}
