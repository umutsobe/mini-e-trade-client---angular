import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailConfirmComponent } from './email-confirm.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [EmailConfirmComponent],
  imports: [CommonModule, NgxSpinnerModule, FormsModule, RouterModule.forChild([{ path: '', component: EmailConfirmComponent }])],
})
export class EmailConfirmModule {}
