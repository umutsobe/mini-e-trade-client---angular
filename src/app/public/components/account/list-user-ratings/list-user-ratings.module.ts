import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUserRatingsComponent } from './list-user-ratings.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';

@NgModule({
  declarations: [ListUserRatingsComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ListUserRatingsComponent }]), FormsModule, RatingModule],
})
export class ListUserRatingsModule {}
