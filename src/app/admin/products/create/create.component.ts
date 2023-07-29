import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateProduct } from 'src/app/contracts/create_product';
import { ProductService } from 'src/app/services/models/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-create',
  template: `
    <div class="w-50 mx-auto">
      <h1 class=" mt-2 text-center ">Create Product</h1>
      <form [formGroup]="frm" (ngSubmit)="onSubmit()" class="create-product-form my-3">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control" id="name" formControlName="name" />
          <div *ngIf="!name.valid && (name.dirty || name.touched)" style="color:chocolate; font-size: 12px;">İsim girişi zorunludur</div>
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">Price</label>
          <input class="form-control" id="price" rows="3" formControlName="price" />
          <div *ngIf="!price.valid && (price.dirty || price.touched)" style="color:chocolate; font-size: 12px;">Fiyat girişi zorunludur</div>
        </div>
        <div class="mb-3">
          <label for="stock" class="form-label">Stock</label>
          <input class="form-control" id="stock" rows="3" formControlName="stock" />
          <div *ngIf="!stock.valid && (stock.dirty || stock.touched)" style="color:chocolate; font-size: 12px;">Stock girişi zorunludur</div>
        </div>
        <button type="submit" class="btn btn-primary" [disabled]="!frm.valid">Submit</button>
      </form>
    </div>
  `,
})
export class CreateComponent {
  frm: FormGroup;
  constructor(private formBuilder: FormBuilder, private productService: ProductService, private toastr: ToastrService, private spinner: NgxSpinnerService) {
    this.frm = formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      stock: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }
  onSubmit() {
    this.spinner.show();
    let product: CreateProduct = {
      name: this.name.value,
      price: parseInt(this.price.value),
      stock: parseFloat(this.stock.value),
    };
    this.productService.create(product).subscribe(
      () => {
        this.toastr.success('Ürün başarıyla eklendi', 'Ürün Ekleme');
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        // İlk olarak, err.error.errors'ı doğrudan errorArray olarak atamak yerine
        // hatanın tümüne erişebilmek için errorObject adında bir değişken oluşturun.
        const errorObject = err.error.errors;

        // Eğer hatanın içindeki hata objeleri key-value şeklindeyse, direkt olarak
        // bu objenin değerlerini gezerek işlem yapabilirsiniz.
        // Burada kullanılan türleri CreateProduct'un türüne göre ayarlayabilirsiniz.
        for (const key in errorObject) {
          if (Object.prototype.hasOwnProperty.call(errorObject, key)) {
            const errorValue = errorObject[key];
            errorValue.forEach((errorMessage) => {
              this.toastr.warning(errorMessage);
            });
          }
        }
      }
    );
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
}
