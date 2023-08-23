import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HubUrlsService {
  baseSginalUrl: string = environment.signalRUrl;

  get ProductHub() {
    return this.baseSginalUrl + 'product-hub';
  }
  get OrderHub() {
    return this.baseSginalUrl + 'orders-hub';
  }
}
