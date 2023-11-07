import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/common/auth/auth.service';
@Component({
  selector: 'app-root',
  template: `
    <ngx-spinner size="medium" type="ball-spin-clockwise-fade">Loading...</ngx-spinner>
    <div>
      <app-header></app-header>
      <app-category></app-category>
      <div style="margin-bottom: 400px;">
        <router-outlet></router-outlet>
      </div>
      <div id="footer" class="d-none">
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [
    `
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
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}
  //sayfayı yenilerken footer gözükmesin diye önlem
  async ngOnInit() {
    await this.authService.identityCheck();
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        document.getElementById('footer').classList.remove('d-none');
      }, 1000);
    }
  }
}
