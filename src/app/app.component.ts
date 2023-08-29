import { Component } from '@angular/core';
import { ApplicationService } from './services/models/application.service';
import { AuthService } from './services/common/auth/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <app-category></app-category>
    <div>
      <router-outlet></router-outlet>
    </div>
    <div>
      <app-footer></app-footer>
    </div>
    <ngx-spinner size="medium" type="ball-spin-clockwise-fade">Loading...</ngx-spinner>
  `,
})
export class AppComponent {}
