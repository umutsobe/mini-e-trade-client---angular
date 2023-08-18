import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoleComponent } from './create-role.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateRoleComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: CreateRoleComponent }]), ReactiveFormsModule],
})
export class CreateRoleModule {}
