import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, AdminRoutingModule, RouterModule, FontAwesomeModule],
})
export class AdminModule {}
