import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateRoleComponent } from './create-role/create-role.component';
import { RoleListComponent } from './role-list/role-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [RoleComponent, CreateRoleComponent, RoleListComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: RoleComponent }]), ReactiveFormsModule, MatFormFieldModule, MatDialogModule, MatTableModule, MatPaginatorModule, NgxSpinnerModule],
})
export class RoleModule {}
