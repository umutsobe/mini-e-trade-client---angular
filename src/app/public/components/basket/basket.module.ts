import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [BasketComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: BasketComponent }]), NgxSpinnerModule],
})
export class BasketModule {}
