import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/contracts/base_url';
import { HttpClientService } from '../common/http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private httpClientService: HttpClientService) {}

  async getBaseStorageUrl(): Promise<BaseUrl> {
    // azure base url'yi api'deki appsetting.json'dan alıyoruz
    const getObservable: Observable<BaseUrl> = this.httpClientService.get<BaseUrl>({
      controller: 'files',
      action: 'GetBaseStorageUrl',
    });

    return await firstValueFrom(getObservable);
  }
}
