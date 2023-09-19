import { NgModule, createComponent } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCreateComponent } from './product-create.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [ProductCreateComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ProductCreateComponent }]), ReactiveFormsModule, MatListModule, AngularEditorModule, FormsModule],
})
export class CreateModule {}
