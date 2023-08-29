import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  template: `
    <div style="margin-bottom: 800px;" class="row">
      <div class="col-4">
        <app-create-category></app-create-category>
      </div>
      <div class="col-8">
        <app-list-category></app-list-category>
      </div>
    </div>
  `,
})
export class CategoriesComponent {}
