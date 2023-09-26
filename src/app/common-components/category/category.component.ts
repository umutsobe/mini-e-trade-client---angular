import { Component, OnInit } from '@angular/core';
import { List_Category } from 'src/app/contracts/category/list_category';
import { CategoryService } from 'src/app/services/models/category.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-category',
  template: `
    <div class="categories" style="height: 40px;">
      <!-- <div class="dropdown">
        <button id="allCategories" class=" dropdown-toggle list-group-item p-2 d-flex" type="button" data-bs-toggle="dropdown" aria-expanded="false">Kategoriler</button>
        <ul class="dropdown-menu" style="width: 340px">
          <div class="row">
            <div class="col-6">
              <div class="">
                <div>aa</div>
                <div>aa</div>
                <div>aa</div>
              </div>
            </div>
            <div class="col-6">
              <div class="">
                <div>aa</div>
                <div>aa</div>
                <div>aa</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="">
                <div>aa</div>
                <div>aa</div>
                <div>aa</div>
              </div>
            </div>
            <div class="col-6">
              <div class="">
                <div>aa</div>
                <div>aa</div>
                <div>aa</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="">
                <div>aa</div>
                <div>aa</div>
                <div>aa</div>
              </div>
            </div>
            <div class="col-6">
              <div class="">
                <div>aa</div>
                <div>aa</div>
                <div>aa</div>
              </div>
            </div>
          </div>
        </ul>
      </div> -->
      <a [routerLink]="['/search']" [queryParams]="{ page: 0 }" id="allProducts" class="list-group-item p-2 d-flex">
        <!-- <fa-icon role="button" class="fs-5 m-0 me-2" [icon]="faBars"></fa-icon> -->
        <p class="m-0">All Products</p>
      </a>

      <a [routerLink]="['/search']" [queryParams]="{ categoryName: category.name }" *ngFor="let category of categories" class="list-group-item p-2">{{ category.name }}</a>
    </div>
  `,
  styleUrls: ['category.component.css'],
})
export class CategoryComponent implements OnInit {
  constructor(private categoryService: CategoryService) {}

  faBars = faBars;
  categories: List_Category[] = [];

  async ngOnInit() {
    this.categories = (await this.categoryService.getCategories(0, 14)).categories;
  }
}
