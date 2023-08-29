import { Component, OnInit } from '@angular/core';
import { List_Category } from 'src/app/contracts/category/list_category';
import { CategoryService } from 'src/app/services/models/category.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-category',
  template: `
    <div class="categories">
      <div routerLink="/products/1" id="all" class="list-group-item p-2 d-flex">
        <fa-icon role="button" class="fs-5 m-0 me-2" [icon]="faBars"></fa-icon>
        <p class="m-0">Tüm Ürünler</p>
      </div>
      <div [routerLink]="['/products/category', category.name, 1]" *ngFor="let category of categories" class="list-group-item p-2">{{ category.name }}</div>
    </div>
  `,
  styleUrls: ['category.component.css'],
})
export class CategoryComponent implements OnInit {
  constructor(private categoryService: CategoryService) {}

  faBars = faBars;
  categories: List_Category[] = [];

  ngOnInit(): void {
    this.categoryService.getCategories(0, 10).then((response) => {
      this.categories = response.categories;
    });
  }
}
