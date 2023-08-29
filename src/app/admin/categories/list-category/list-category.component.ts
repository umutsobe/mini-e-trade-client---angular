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
    <div class="mat-elevation-z8">
      <table mat-table [dataSource]="dataSource">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>name</th>
          <td mat-cell *matCellDef="let element">{{ element.name }}</td>
        </ng-container>

        <ng-container matColumnDef="edit">
          <th mat-header-cell *matHeaderCellDef>edit</th>
          <td mat-cell *matCellDef="let element">
            <img src="/assets/edit.png" width="25" style="cursor:pointer;" />
          </td>
        </ng-container>

        <ng-container matColumnDef="delete">
          <th mat-header-cell *matHeaderCellDef>Delete</th>
          <td mat-cell *matCellDef="let element">
            <img type="button" data-bs-toggle="modal" data-bs-target="#deleteCategory" (click)="openDeleteDialog(element)" src="/assets/delete.png" width="25" style="cursor:pointer;" />
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <mat-paginator (page)="pageChanged()" [pageSizeOptions]="[5, 10]" showFirstLastButtons aria-label="Select page of periodic elements"> </mat-paginator>
    </div>
    <div class="d-flex justify-content-end mt-2">
      <button (click)="refresh()" id="refresh" class="btn btn-primary">Refresh</button>
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
            <p class="text-danger">Kategori silme işlemi geri alınamaz!!!</p>
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

  displayedColumns: string[] = ['name', 'edit', 'delete'];
  dataSource: MatTableDataSource<List_Category> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getCategories() {
    this.spinner.show();

    const allCategories: { categories: List_Category[]; totalCategoryCount: number } = await this.categoryService.getCategories(
      this.paginator ? this.paginator.pageIndex : 0,
      this.paginator ? this.paginator.pageSize : 5,
      () => {
        this.spinner.hide();
      },
      (errorMessage) => {
        this.spinner.hide();
      }
    );

    this.dataSource = new MatTableDataSource<List_Category>(allCategories.categories);
    this.paginator.length = allCategories.totalCategoryCount;
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
        this.toastr.success(`${this.selectedCategory.name} başarıyla silindi`, 'Başarılı');
        this.getCategories();
      })
      .catch((err) => {
        this.spinner.hide();
        this.toastr.error(err);
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
