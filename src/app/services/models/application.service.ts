import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Menu } from 'src/app/contracts/application-configurations/menu';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  constructor(private httpService: HttpClientService) {}

  async getAuthorizeDefinitionEndpoints() {
    const observable: Observable<Menu[]> = this.httpService.get({
      controller: 'applicationservices',
    });

    return await firstValueFrom(observable);
  }
}
