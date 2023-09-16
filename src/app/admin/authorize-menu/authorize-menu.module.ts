import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizeMenuComponent } from './authorize-menu.component';
import { RouterModule } from '@angular/router';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [AuthorizeMenuComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: AuthorizeMenuComponent }]), MatButtonModule, MatTreeModule, MatIconModule, NgxSpinnerModule, MatListModule],
})
export class AuthorizeMenuModule {}
