import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private httpClientService: HttpClientService) {}

  async getRoles(page: number, size: number, successCallBack?: () => void, errorCallBack?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.get({
      controller: 'roles',
      queryString: `page=${page}&size=${size}`,
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack).catch(errorCallBack);

    return await promiseData;
  }

  async create(name: string) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: 'roles',
      },
      { name: name }
    );

    return await firstValueFrom(observable);
  }
  async delete(id: string) {
    const observable: Observable<any> = this.httpClientService.delete(
      {
        controller: 'roles',
      },
      id
    );

    return await firstValueFrom(observable);
  }
}
