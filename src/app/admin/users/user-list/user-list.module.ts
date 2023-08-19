import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [UserListComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: UserListComponent }]), MatFormFieldModule, MatDialogModule, MatTableModule, MatPaginatorModule, NgxSpinnerModule, MatListModule],
  exports: [UserListComponent],
})
export class UserListModule {}
