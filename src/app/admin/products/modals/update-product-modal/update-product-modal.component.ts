import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { List_Product } from 'src/app/contracts/product/list_product';
import { UpdateProduct } from 'src/app/contracts/product/update_product';
import { ProductService } from 'src/app/services/models/product.service';
import { ListComponent } from '../../list/list.component';

@Component({
  selector: 'app-update-product-modal',
  template: `
    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Product Update</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h4>Product to be updated: {{ selectedProduct ? selectedProduct.name : '' }}</h4>

            <form [formGroup]="frm" (ngSubmit)="update()" class=" my-3">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" formControlName="name" />
                <div *ngIf="submitted">
                  <div *ngIf="name.hasError('required')" class="inputError">Name is required</div>
                  <div *ngIf="name.hasError('maxlength')" class="inputError">Name must be less than 150 characters</div>
                </div>
              </div>

              <div class="d-flex justify-content-evenly">
                <div class="mb-3">
                  <label for="price" class="form-label">Price</label>
                  <input class="form-control" id="price" rows="3" formControlName="price" />
                  <div *ngIf="submitted">
                    <div *ngIf="price.hasError('required')" class="inputError">Price is required</div>
                    <div *ngIf="price.hasError('pattern')" class="inputError">Price cannot be less than zero.</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="stock" class="form-label">Stock</label>
                  <input class="form-control" id="stock" rows="3" formControlName="stock" />
                  <div *ngIf="submitted">
                    <div *ngIf="stock.hasError('required')" class="inputError">Stock is required</div>
                    <div *ngIf="stock.hasError('pattern')" class="inputError">Stock cannot be less than zero.</div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="name" class="form-label">Description</label>
                <angular-editor formControlName="description" [config]="editorConfig"></angular-editor>
                <div *ngIf="submitted">
                  <div *ngIf="description.hasError('required')" class="inputError">Description is required</div>
                  <div *ngIf="description.hasError('maxlength')" class="inputError">Description must be less than 4000 characters</div>
                </div>
              </div>
              <div style="width: 100%;" class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
      .inputError {
        color: chocolate;
        font-size: 12px;
      }
    `,
  ],
})
export class UpdateProductModalComponent {
  @Input() selectedProduct: List_Product;
  frm: FormGroup;
  submitted = false;

  constructor(private productService: ProductService, private spinner: NgxSpinnerService, private toastr: ToastrService, private formBuilder: FormBuilder, @Inject(ListComponent) private adminProductListComponent: ListComponent) {
    this.frm = formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      stock: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      description: ['', [Validators.required, Validators.maxLength(4000)]],
    });
  }

  update() {
    this.submitted = true;
    if (this.frm.invalid) return;

    this.spinner.show();

    const product: UpdateProduct = {
      id: this.selectedProduct.id,
      name: this.name.value,
      price: parseInt(this.price.value),
      stock: parseFloat(this.stock.value),

      description: this.description.value,
    };

    this.productService
      .updateProduct(product)
      .then(() => {
        this.spinner.hide();
        this.toastr.success(`${product.name} successfully updated`);
        this.adminProductListComponent.getProducts();
      })
      .catch((err) => {
        this.spinner.hide();
      });
  }

  getProduct(product: List_Product) {
    this.name.setValue(product.name);
    this.price.setValue(product.price);
    this.stock.setValue(product.stock);
    this.description.setValue(product.description);
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
