import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateRoleComponent } from './create-role/create-role.component';
import { RoleListComponent } from './role-list/role-list.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [RoleComponent, CreateRoleComponent, RoleListComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: RoleComponent }]), ReactiveFormsModule, NgxSpinnerModule],
})
export class RoleModule {}
