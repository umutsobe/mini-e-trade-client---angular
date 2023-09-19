import { AfterViewChecked, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <ngx-spinner size="medium" type="ball-spin-clockwise-fade">Loading...</ngx-spinner>
    <div>
      <app-header></app-header>
      <app-category></app-category>
      <div style="margin-bottom: 300px;">
        <router-outlet></router-outlet>
      </div>
      <div id="footer" class="d-none">
        <app-footer></app-footer>
      </div>
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
export class AppComponent implements OnInit {
  //sayfayı yenilerken footer gözükmesin diye önlem
  ngOnInit(): void {
    setTimeout(() => {
      document.getElementById('footer').classList.remove('d-none');
    }, 1000);
  }
}
