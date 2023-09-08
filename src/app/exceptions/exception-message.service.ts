import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExceptionMessageService {
  constructor() {}

  createOrderMessage(fullError: string): string {
    return this.getErrorMessage(fullError, ExceptionEndMarkers.createOrder);
  }

  basketItemUpdateQuantity(fullError: string): string {
    return this.getErrorMessage(fullError, ExceptionEndMarkers.basketItemUpdateQuantity);
  }

  addToBasket(fullError: string): string {
    return this.getErrorMessage(fullError, ExceptionEndMarkers.addToBasket);
  }

  getErrorMessage(fullError: string, _endMarker: string): string | null {
    const startMarker = 'e_trade_api.application.CustomException:';
    const endMarker = _endMarker;

    const startIndex = fullError.indexOf(startMarker);
    const endIndex = fullError.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
      return null;
    }

    const message = fullError.substring(startIndex + startMarker.length, endIndex).trim();
    return message;
  }
}

export enum ExceptionEndMarkers {
  'createOrder' = 'at e_trade_api.Persistence.OrderService.CreateOrderAsync',
  'basketItemUpdateQuantity' = 'at e_trade_api.Persistence.BasketService.UpdateQuantityAsync',
  'addToBasket' = 'at e_trade_api.Persistence.BasketService.AddItemToBasketAsync',
}
