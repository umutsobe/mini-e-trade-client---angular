import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: HomeComponent }]), CarouselModule],
})
export class HomeModule {}
