import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [UserListComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: UserListComponent }]), NgxSpinnerModule, MatListModule],
  exports: [UserListComponent],
})
export class UserListModule {}
