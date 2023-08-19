import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { RouterModule } from '@angular/router';
import { UserListModule } from './user-list/user-list.module';

@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: UsersComponent }]), UserListModule],
})
export class UsersModule {}
