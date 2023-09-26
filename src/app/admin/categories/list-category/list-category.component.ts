import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { List_Category } from 'src/app/contracts/category/list_category';
import { CategoryService } from 'src/app/services/models/category.service';

@Component({
  selector: 'app-list-category',
  template: `
    <h1 class="mt-2 text-center" id="title">Categories</h1>
    <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px;">
      <table class="table table-striped table-responsive">
        <thead>
          <tr class="text-center">
            <th scope="col">name</th>
            <th scope="col">edit</th>
            <th scope="col">delete</th>
          </tr>
        </thead>
        <tbody *ngIf="this.allCategories">
          <tr *ngFor="let category of this.allCategories.categories" class="text-center">
            <td>{{ category.name }}</td>
            <td>
              <img src="/assets/edit.png" width="25" style="cursor:pointer;" />
            </td>
            <td>
              <img type="button" data-bs-toggle="modal" data-bs-target="#deleteCategory" (click)="openDeleteDialog(category)" src="/assets/delete.png" width="25" style="cursor:pointer;" />
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-4 pagination d-flex justify-content-center">
        <div style="margin: 6px 8px 0 0;">{{ currentPageNo + 1 + '-' + totalPageCount }}</div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="first()"><<</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="prev()"><</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="next()">></a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="last()">>></a></div>
      </div>

      <div class="d-flex justify-content-end mt-2">
        <button (click)="refresh()" id="refresh" class="btn btn-primary">Refresh</button>
      </div>
    </div>

    <!-- delete dialog -->

    <div class="modal fade" id="deleteCategory" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Kategori Silme İşlemi</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-danger">Category deletion is irreversible</p>
            <p>Silinecek Kategori: {{ selectedCategory ? selectedCategory.name : '' }}</p>
            <!-- null hatası almamak için kontrol -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button (click)="delete()" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ListCategoryComponent {
  constructor(private spinner: NgxSpinnerService, private toastr: ToastrService, private categoryService: CategoryService) {}

  allCategories: { totalCategoryCount: number; categories: List_Category[] };
  currentPageNo = 0;
  totalCategoryCount: number;
  totalPageCount: number;
  pageSize = 8;

  async getCategories() {
    this.spinner.show();

    const allCategories: { categories: List_Category[]; totalCategoryCount: number } = await this.categoryService.getCategories(
      this.currentPageNo,
      this.pageSize,
      () => {
        this.spinner.hide();
      },
      (errorMessage) => {
        this.spinner.hide();
      }
    );

    this.allCategories = allCategories;
    this.totalCategoryCount = allCategories.totalCategoryCount;
    this.totalPageCount = Math.ceil(this.totalCategoryCount / this.pageSize);
  }
  prev() {
    if (this.currentPageNo > 0) {
      this.currentPageNo--;
      this.getCategories();
    }
  }
  next() {
    if (this.currentPageNo != this.totalPageCount - 1) {
      this.currentPageNo++;
      this.getCategories();
    }
  }
  first() {
    this.currentPageNo = 0;
    this.getCategories();
  }
  last() {
    this.currentPageNo = this.totalPageCount - 1;
    this.getCategories();
  }
  selectedCategory: List_Category = {
    id: '',
    name: '',
  };

  openDeleteDialog(element) {
    this.selectedCategory = element;
  }

  delete() {
    this.spinner.show();

    this.categoryService
      .delete(this.selectedCategory.id)
      .then(() => {
        this.spinner.hide();
        this.toastr.success('Success');
        this.getCategories();
      })
      .catch((err) => {
        this.spinner.hide();
      });
  }

  async ngOnInit() {
    await this.getCategories();
  }
  async pageChanged() {
    await this.getCategories();
  }
  async refresh() {
    await this.getCategories();
  }
}
