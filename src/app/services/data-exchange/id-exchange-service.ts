import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdExchangeService {
  private id: string;

  getId(): string {
    return this.id;
  }
  setId(id: string) {
    this.id = id;
  }
}
