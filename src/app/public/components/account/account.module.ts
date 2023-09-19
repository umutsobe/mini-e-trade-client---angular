import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, AccountRoutingModule, RouterModule.forChild([{ path: '', component: AccountComponent }]), FontAwesomeModule],
})
export class AccountModule {}
