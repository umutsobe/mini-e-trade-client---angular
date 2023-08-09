import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { Observable, firstValueFrom, map } from 'rxjs';
import { List_Basket_Item } from 'src/app/contracts/basket/list_basket_item';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { Update_Basket_Item } from 'src/app/contracts/basket/update_basket_item';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  constructor(private httpClientService: HttpClientService, private jwtHelper: JwtHelperService) {}

  getBasketId(): string {
    const token = localStorage.getItem('accessToken');
    const decodedToken = this.jwtHelper.decodeToken(token);

    const basketId: string = decodedToken.basketId;
    return basketId;
  }

  get(): Observable<List_Basket_Item[]> {
    let BasketId = this.getBasketId();

    return this.httpClientService.get<List_Basket_Item[]>(
      {
        controller: 'baskets',
      },
      BasketId
    );
  }

  async add(basketItem: Create_Basket_Item): Promise<void> {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: 'baskets',
      },
      basketItem
    );

    await firstValueFrom(observable);
  }

  async updateQuantity(basketItem: Update_Basket_Item): Promise<void> {
    const observable: Observable<any> = this.httpClientService.put(
      {
        controller: 'baskets',
      },
      basketItem
    );

    await firstValueFrom(observable);
  }

  async remove(basketItemId: string) {
    const observable: Observable<any> = this.httpClientService.delete(
      {
        controller: 'baskets',
      },
      basketItemId
    );

    await firstValueFrom(observable);
  }
}
