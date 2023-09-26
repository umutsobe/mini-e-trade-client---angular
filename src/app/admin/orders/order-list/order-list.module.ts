import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './order-list.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrderListComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: OrderListComponent }]), MatFormFieldModule, MatTableModule, FormsModule, MatPaginatorModule, NgxSpinnerModule],
})
export class OrderListModule {}
