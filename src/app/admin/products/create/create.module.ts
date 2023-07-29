import { NgModule, createComponent } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: CreateComponent }]), ReactiveFormsModule],
  exports: [CreateComponent],
})
export class CreateModule {}
