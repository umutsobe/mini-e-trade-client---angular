import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpClientService } from './services/common/http-client.service';
import { Product } from './contracts/product';
declare var $: any;
@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <button (click)="get()" class="btn btn-primary mx-4">GET</button>
    <button (click)="post()" class="btn btn-primary me-4">POST</button>
    <button (click)="put()" class="btn btn-primary me-4">PUT</button>
    <button (click)="delete()" class="btn btn-primary me-4">DELETE</button>
  `,
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClientService) {}
  ngOnInit(): void {}
  get() {
    this.http
      .get<Product[]>({
        controller: 'ProductControllers',
      })
      .subscribe((data) => console.log(data));
  }
  post() {
    this.http
      .post(
        {
          controller: 'ProductControllers',
        },
        {
          name: 'iPhone 11',
          stock: 100,
          price: 30000,
        }
      )
      .subscribe();
    this.http
      .post(
        {
          controller: 'ProductControllers',
        },
        {
          name: 'Macbook Pro',
          stock: 20,
          price: 40000,
        }
      )
      .subscribe();
    this.http
      .post(
        {
          controller: 'ProductControllers',
        },
        {
          name: 'Kalem',
          stock: 400,
          price: 15,
        }
      )
      .subscribe();
  }
  put() {
    this.http
      .put(
        {
          controller: 'ProductControllers',
        },
        {
          id: 'FA8449EB-E915-4736-9633-08DB894F8FD1',
          name: 'iPhone 11',
          price: 35000,
          stock: 205,
        }
      )
      .subscribe();
  }

  delete() {
    let id: string = '01A08D9A-BAB4-40C0-EC35-08DB89554381';
    this.http
      .delete(
        {
          controller: 'ProductControllers',
        },
        id
      )
      .subscribe();
  }
}
