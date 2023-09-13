import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category/category.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CategoryComponent, HeaderComponent, FooterComponent],
  imports: [CommonModule, FontAwesomeModule, RouterModule, ReactiveFormsModule, FormsModule],
  exports: [CategoryComponent, HeaderComponent, FooterComponent],
})
export class CommonComponentsModule {}
