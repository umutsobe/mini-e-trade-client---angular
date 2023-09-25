import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: HomeComponent }]), CarouselModule, LazyLoadImageModule],
})
export class HomeModule {}
