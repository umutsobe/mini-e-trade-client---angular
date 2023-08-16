import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './order-list.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [OrderListComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: OrderListComponent }]), MatFormFieldModule, MatDialogModule, MatTableModule, MatPaginatorModule, NgxSpinnerModule],
  exports: [OrderListComponent],
})
export class OrderListModule {}
