import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateProduct } from 'src/app/contracts/product/create_product';
import { ProductService } from 'src/app/services/models/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { List_Category } from 'src/app/contracts/category/list_category';
import { CategoryService } from 'src/app/services/models/category.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-create',
  template: `
    <div class="d-flex justify-content-center">
      <div>
        <h1 class=" mt-2 text-center ">Create Product</h1>
        <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px;">
          <form [formGroup]="frm" (ngSubmit)="onSubmit()" class=" my-3">
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-control" id="name" formControlName="name" />
              <div *ngIf="!name.valid && (name.dirty || name.touched)" style="color:chocolate; font-size: 12px;">The name field is required</div>
            </div>

            <div class="d-flex justify-content-evenly">
              <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input class="form-control" id="price" rows="3" formControlName="price" />
                <div *ngIf="!price.valid && (price.dirty || price.touched)" style="color:chocolate; font-size: 12px;">The price field is required</div>
              </div>

              <div class="mb-3">
                <label for="stock" class="form-label">Stock</label>
                <input class="form-control" id="stock" rows="3" formControlName="stock" />
                <div *ngIf="!stock.valid && (stock.dirty || stock.touched)" style="color:chocolate; font-size: 12px;">The stock field is required</div>
              </div>
            </div>

            <div class="mb-3">
              <label for="name" class="form-label">Description</label>
              <angular-editor formControlName="description" [config]="editorConfig"></angular-editor>
              <div class="my-2" style="font-size: 13px;">The description field is required!</div>
            </div>

            <div class="mb-3">
              <div class="form-check">
                <label class="form-check-label" for="isActive"> Is Active </label>
                <input class="form-check-input" type="checkbox" id="isActive" formControlName="isActive" value="" checked />
              </div>
            </div>

            <button type="button" (click)="openCategoryDialog()" data-bs-toggle="modal" data-bs-target="#categoryModal" class="btn btn-warning mb-4 btn-sm" style="display: block;">Select Categories</button>

            <div style="font-size: 15px;" *ngIf="selectedCategories.length > 0" class="d-flex align-items-center mb-3">Seçilen Kategoriler: {{ selectedCategories ? selectedCategories : '' }}</div>

            <button type="submit" class="btn btn-primary" [disabled]="!frm.valid">Submit</button>
          </form>
        </div>
      </div>
    </div>

    <!-- category modal -->
    <div class="modal fade" id="categoryModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body">
            <h1 class="ms-2">Categories</h1>
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
  styles: [
    `
      *:focus {
        box-shadow: none !important;
      }

      ::ng-deep angular-editor-toolbar * {
        font-family: FontAwesome !important;
        color: black;
      }
      ::ng-deep .angular-editor-button[title='Insert Image'] {
        display: none;
      }
      ::ng-deep .angular-editor-button[title='Insert Video'] {
        display: none;
      }
      ::ng-deep .angular-editor-button[title='Insert Link'] {
        display: none;
      }
      ::ng-deep .angular-editor-button[title='Unlink'] {
        display: none;
      }
    `,
  ],
})
export class CreateComponent {
  frm: FormGroup;

  constructor(private formBuilder: FormBuilder, private productService: ProductService, private toastr: ToastrService, private spinner: NgxSpinnerService, private categoryService: CategoryService) {
    this.frm = formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      stock: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      isActive: [''],
      description: ['', [Validators.required, Validators.maxLength(1500)]],
    });
  }

  categories: { categories: List_Category[]; totalCategoryCount: number };
  assignedCategories: string[] = [];
  listCategories: { name: string; selected: boolean }[];
  selectedCategories: string[] = [];

  async openCategoryDialog() {
    this.categories = await this.categoryService.getCategories(0, 100);

    this.listCategories = this.categories.categories.map((r: any) => {
      return {
        name: r.name,
        selected: this.selectedCategories?.indexOf(r.name) > -1,
      };
    });
  }

  assignCategories(categoryComponent) {
    this.selectedCategories = categoryComponent.selectedOptions.selected.map((o) => o._elementRef.nativeElement.innerText);
  }

  closeCategoryDialog() {
    this.listCategories = [];
  }

  onSubmit() {
    // this.spinner.show();

    const product: CreateProduct = {
      name: this.name.value,
      price: parseInt(this.price.value),
      stock: parseFloat(this.stock.value),

      description: this.description.value,
      categoryNames: this.selectedCategories,
      isActive: this.isActive.value,
    };

    console.log(product);

    this.productService
      .create(product)
      .then(() => {
        this.spinner.hide();
        this.toastr.success(`${product.name} successfully created`);
      })
      .catch((err) => {
        this.spinner.hide();
        const errorObject = err.error.errors;

        for (const key in errorObject) {
          if (Object.prototype.hasOwnProperty.call(errorObject, key)) {
            const errorValue = errorObject[key];
            errorValue.forEach((errorMessage) => {
              this.toastr.warning(errorMessage);
            });
          }
        }
      });
  }

  get name() {
    return this.frm.get('name');
  }
  get price() {
    return this.frm.get('price');
  }
  get stock() {
    return this.frm.get('stock');
  }
  get isActive() {
    return this.frm.get('isActive');
  }

  get description() {
    return this.frm.get('description');
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '150px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    // uploadUrl: 'v1/image',
    // upload: (file: File) => { ... }
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
  };
}
