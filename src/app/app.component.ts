import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <div>
      <router-outlet></router-outlet>
    </div>
    <div style="margin-top: 250px;">
      <app-footer></app-footer>
    </div>
  `,
})
export class AppComponent {}
