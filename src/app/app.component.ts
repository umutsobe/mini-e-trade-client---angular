import { Component } from '@angular/core';
import { ApplicationService } from './services/models/application.service';
import { AuthService } from './services/common/auth/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <app-header></app-header>
      <app-category></app-category>
      <div>
        <router-outlet></router-outlet>
      </div>
      <div>
        <app-footer></app-footer>
      </div>
      <ngx-spinner size="medium" type="ball-spin-clockwise-fade">Loading...</ngx-spinner>
    </div>
  `,
  styles: [
    `
      /* mat selection list kullanan her yere yapıştır. dark theme'de sorun çıkıyor */

      *:focus {
        box-shadow: none !important;
      }

      ::ng-deep .mat-mdc-list-item-unscoped-content {
        color: #8f8979 !important;
      }
      ::ng-deep .mdc-checkbox__background {
        border-color: #8f8979 !important;
      }
    `,
  ],
})
export class AppComponent {}
