import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  template: `
    <div style="margin-bottom: 800px;" class="row">
      <div class="container w-50">
        <app-create-category></app-create-category>
      </div>
      <app-list-category></app-list-category>
    </div>
  `,
})
export class CategoriesComponent {}
