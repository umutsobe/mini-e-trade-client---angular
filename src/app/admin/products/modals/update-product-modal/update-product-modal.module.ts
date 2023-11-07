import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateProductModalComponent } from './update-product-modal.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [UpdateProductModalComponent],
  imports: [CommonModule, NgxSpinnerModule, ReactiveFormsModule, AngularEditorModule],
  exports: [UpdateProductModalComponent],
})
export class UpdateProductModalModule {}
