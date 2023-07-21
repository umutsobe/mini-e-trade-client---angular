import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpClientService } from './services/common/http-client.service';
declare var $: any;
@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClientService) {}
  ngOnInit(): void {}
}
