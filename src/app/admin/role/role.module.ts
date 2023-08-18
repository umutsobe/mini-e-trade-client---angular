import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role.component';
import { RouterModule } from '@angular/router';
import { CreateRoleModule } from './create-role/create-role.module';
import { RoleListModule } from './role-list/role-list.module';

@NgModule({
  declarations: [RoleComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: RoleComponent }]), CreateRoleModule, RoleListModule],
})
export class RoleModule {}
