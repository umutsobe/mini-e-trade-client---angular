import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizeMenuComponent } from './authorize-menu.component';
import { RouterModule } from '@angular/router';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
@NgModule({
  declarations: [AuthorizeMenuComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: AuthorizeMenuComponent }]), MatTreeModule, MatIconModule, NgxSpinnerModule, MatButtonModule, MatListModule],
})
export class AuthorizeMenuModule {}
