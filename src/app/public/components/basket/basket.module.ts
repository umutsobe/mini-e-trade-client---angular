import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BasketComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: BasketComponent }]), NgxSpinnerModule, FontAwesomeModule, FormsModule],
})
export class BasketModule {}
