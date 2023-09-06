import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  template: `
    <div style="" class="">
      <div>
        <app-create-category></app-create-category>
      </div>
      <app-list-category></app-list-category>
    </div>
  `,
})
export class CategoriesComponent {}
