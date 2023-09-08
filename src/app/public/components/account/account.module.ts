import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { RouterModule } from '@angular/router';
import { UserDetailsModule } from './user-details/user-details.module';
import { UserOrdersModule } from './user-orders/user-orders.module';
import { PasswordChangeModule } from './password-change/password-change.module';
import { AddresessModule } from './addresess/addresess.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, RouterModule, RouterModule.forChild([{ path: '', component: AccountComponent }]), UserDetailsModule, UserOrdersModule, PasswordChangeModule, AddresessModule, FontAwesomeModule],
})
export class AccountModule {}
