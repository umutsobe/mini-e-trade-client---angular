import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Create_Order } from 'src/app/contracts/order/create_order';
import { List_Order } from 'src/app/contracts/order/list-order';
import { SingleOrder } from 'src/app/contracts/order/single_order';
import { CreateOrderResponse } from 'src/app/contracts/order/create-order-response';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpCLientService: HttpClientService) {}

  async create(order: Create_Order): Promise<CreateOrderResponse> {
    const observable: Observable<CreateOrderResponse | any> = this.httpCLientService.post(
      {
        controller: 'order',
        action: 'CreateOrder',
      },
      order
    );

    return (await firstValueFrom(observable)) as CreateOrderResponse;
  }
  async read(page = 0, size = 5, successCallback?: () => void, errorCallback?: (errorMessage: string) => void): Promise<{ totalOrderCount: number; orders: List_Order[] }> {
    const observable: Observable<{ totalOrderCount: number; orders: List_Order[] }> = this.httpCLientService.get({
      controller: 'order',
      queryString: `page=${page}&size=${size}`,
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then((value) => successCallback()).catch((error) => errorCallback(error));

    return await promiseData;
  }
  async getOrderById(id: string) {
    const observable: Observable<SingleOrder> = this.httpCLientService.get<SingleOrder>(
      {
        controller: 'order',
      },
      id
    );

    return await firstValueFrom(observable);
  }

  async completeOrder(id: string): Promise<void> {
    const observable: Observable<any> = this.httpCLientService.get(
      {
        controller: 'order',
        action: 'complete-order',
      },
      id
    );

    await firstValueFrom(observable);
  }

  async isOrderValid(orderCode: string) {
    const observable: Observable<any> = this.httpCLientService.get<SingleOrder>(
      {
        controller: 'order',
        action: 'IsOrderValid',
      },
      orderCode
    );

    return await firstValueFrom(observable);
  }
}
