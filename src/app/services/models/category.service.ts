import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpClientService: HttpClientService) {}

  async getCategories(page: number, size: number, successCallBack?: () => void, errorCallBack?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.get({
      controller: 'category',
      action: 'GetAllCategories',
      queryString: `page=${page}&size=${size}`,
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack).catch(errorCallBack);

    return await promiseData;
  }

  async create(name: string) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: 'category',
        action: 'CreateCategory',
      },
      { name: name }
    );

    return await firstValueFrom(observable);
  }
  async delete(id: string) {
    const observable: Observable<any> = this.httpClientService.delete(
      {
        controller: 'category',
        action: 'DeleteCategory',
      },
      id
    );

    return await firstValueFrom(observable);
  }
}
