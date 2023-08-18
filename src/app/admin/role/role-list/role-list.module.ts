import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleListComponent } from './role-list.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [RoleListComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: RoleListComponent }]), MatFormFieldModule, MatDialogModule, MatTableModule, MatPaginatorModule, NgxSpinnerModule],
})
export class RoleListModule {}
