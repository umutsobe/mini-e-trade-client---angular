import { NgModule, createComponent } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [CreateComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: CreateComponent }]), ReactiveFormsModule, MatListModule, AngularEditorModule, FormsModule],
})
export class CreateModule {}
