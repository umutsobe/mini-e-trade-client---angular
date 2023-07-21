import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  template: `
    <div class="row">
      <div class="col-3 left-panel">
        <app-create></app-create>
      </div>
      <div class="col-9 right-panel">
        <app-list></app-list>
      </div>
    </div>
    <ngx-spinner size="medium" type="ball-spin-clockwise-fade">Loading...</ngx-spinner>
  `,
  styleUrls: ['products.component.style.css'],
})
export class ProductsComponent {}
