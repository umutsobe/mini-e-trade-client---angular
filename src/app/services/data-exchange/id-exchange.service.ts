import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdExchangeService {
  public id: string;

  getId(): string {
    return this.id;
  }
  setId(id) {
    this.id = id;
  }
}
