import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Create_Order } from 'src/app/contracts/order/create_order';
import { List_Order } from 'src/app/contracts/order/list-order';
import { SingleOrder } from 'src/app/contracts/order/single_order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpCLientService: HttpClientService) {}

  async create(order: Create_Order): Promise<void> {
    const observable: Observable<any> = this.httpCLientService.post(
      {
        controller: 'order',
      },
      order
    );

    await firstValueFrom(observable);
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
  async getOrderById(id: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    const observable: Observable<SingleOrder> = this.httpCLientService.get<SingleOrder>(
      {
        controller: 'order',
      },
      id
    );

    const promiseData = firstValueFrom(observable);
    promiseData.then((value) => successCallBack()).catch((error) => errorCallBack(error));

    return await promiseData;
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

  async delete() {}
}
