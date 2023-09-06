import { Injectable } from '@angular/core';
import { AuthService } from '../common/auth/auth.service';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpClientService } from '../common/http-client.service';
import { CreateRating } from 'src/app/contracts/productRating/create_rating';
import { UpdateRating } from 'src/app/contracts/productRating/update_rating';
import { ListProductRatings } from 'src/app/contracts/productRating/listProductRatings/list_product_ratings';
import { ListUserRatings } from 'src/app/contracts/productRating/listUserRatings/list_user_ratings';

@Injectable({
  providedIn: 'root',
})
export class ProuductRatingService {
  constructor(private authService: AuthService, private http: HttpClientService) {}

  async deleteRating(ratingId: string): Promise<any> {
    const observable: Observable<any> = this.http.delete(
      {
        controller: 'ProductRating',
        action: 'DeleteRating',
      },
      ratingId
    );

    return await firstValueFrom(observable);
  }

  async createRating(model: CreateRating): Promise<any> {
    const observable: Observable<any> = this.http.post(
      {
        controller: 'ProductRating',
        action: 'CreateRating',
      },
      model
    );

    return await firstValueFrom(observable);
  }

  async updateRate(model: UpdateRating) {
    const observable: Observable<any> = this.http.put(
      {
        controller: 'ProductRating',
        action: 'CreateRating',
      },
      model
    );

    return await firstValueFrom(observable);
  }

  async getProductRatings(queryString: string): Promise<ListProductRatings> {
    const observable: Observable<ListProductRatings> = this.http.get({
      controller: 'ProductRating',
      action: 'GetProductRatings',
      queryString: `${queryString}`,
    });

    return await firstValueFrom(observable);
  }

  async getUserRatings(queryString: string): Promise<ListUserRatings> {
    const observable: Observable<ListUserRatings> = this.http.get({
      controller: 'ProductRating',
      action: 'GetUserRatings',
      queryString: `${queryString}`,
    });

    return await firstValueFrom(observable);
  }

  async isProductReviewPending(queryString: string): Promise<any> {
    const observable: Observable<any> = this.http.get({
      controller: 'ProductRating',
      action: 'IsProductReviewPending',
      queryString: `${queryString}`,
    });

    return await firstValueFrom(observable);
  }
}
