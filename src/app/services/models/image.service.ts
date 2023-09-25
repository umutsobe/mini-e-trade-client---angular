import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpClientService } from '../common/http-client.service';
import { UpdateOrderDefinition } from 'src/app/admin/image-control/images-control.component';

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

  async updateOrderDefinitionImages(model: UpdateOrderDefinition): Promise<any> {
    const observable: Observable<any> = this.http.post(
      {
        controller: 'image',
        action: 'UpdateOrderDefinitionImages',
      },
      model
    );

    return await firstValueFrom(observable);
  }
}
