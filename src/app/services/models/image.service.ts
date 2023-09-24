import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpClientService } from '../common/http-client.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClientService) {}

  async deleteImage(id: string): Promise<any> {
    const observable: Observable<any> = this.http.delete(
      {
        controller: 'image',
        action: 'DeleteImage',
      },
      id
    );

    return await firstValueFrom(observable);
  }
  async getImagesByDefinition(definition: string): Promise<any> {
    const observable: Observable<any> = this.http.get(
      {
        controller: 'image',
        action: 'getImagesByDefinition',
      },
      definition
    );

    return await firstValueFrom(observable);
  }
}
