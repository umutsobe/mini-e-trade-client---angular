import { Component, Input, OnInit } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { List_Category } from 'src/app/contracts/category/list_category';
import { List_Product } from 'src/app/contracts/product/list_product';
import { CategoryService } from 'src/app/services/models/category.service';
import { ProductService } from 'src/app/services/models/product.service';

@Component({
  selector: 'app-product-category-modal',
  template: `
    <div class="modal fade" id="categoryModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body">
            <h2>{{ selectedProduct ? selectedProduct.name : '' }}</h2>
            <mat-selection-list #categoryComponent>
              <mat-list-option *ngFor="let category of listCategories" selected="{{ category.selected }}">
                {{ category.name }}
              </mat-list-option>
            </mat-selection-list>
          </div>
          <div class="modal-footer">
            <button (click)="assignCategories(categoryComponent)" type="button" class="btn btn-primary">Assign Categories</button>
            <button (click)="closeCategoryDialog()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProductCategoryModalComponent {
  @Input() selectedProduct: List_Product;

  constructor(private productService: ProductService, private spinner: NgxSpinnerService, private categoryService: CategoryService, private toastr: ToastrService) {}

  categories: { categories: List_Category[]; totalCategoryCount: number };
  assignedCategories: Array<string> = [];
  listCategories: { name: string; selected: boolean }[];

  async getCategories(id: string) {
    this.spinner.show();

    this.assignedCategories = await this.productService.getCategoriesByProductId(id);

    this.categories = await this.categoryService.getCategories(0, 100);

    this.listCategories = this.categories.categories.map((r: any) => {
      return {
        name: r.name,
        selected: this.assignedCategories?.indexOf(r.name) > -1,
      };
    });

    this.spinner.hide();
  }

  assignCategories(categoryComponent: MatSelectionList) {
    this.spinner.show();
    const categories: string[] = categoryComponent.selectedOptions.selected.map((o) => o._elementRef.nativeElement.innerText);
    this.productService
      .assignCategoriesToProduct(this.selectedProduct.id, categories)
      .then(() => {
        this.toastr.success('Categories Successfully Assigned');
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  closeCategoryDialog() {
    this.listCategories = [];
  }
}
