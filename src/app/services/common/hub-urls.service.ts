import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HubUrlsService {
  constructor(@Inject('baseSignalRUrl') private baseSginalUrl: string) {}

  get ProductHub() {
    return this.baseSginalUrl + 'product-hub';
  }
  get OrderHub() {
    return this.baseSginalUrl + 'orders-hub';
  }
}
