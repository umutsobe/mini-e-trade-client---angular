import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/models/category.service';

@Component({
  selector: 'app-create-category',
  template: `
    <div class="d-flex justify-content-center">
      <div class="col-11 col-sm-7 col-md-6 col-lg-4">
        <h1 class=" mt-2 text-center ">Create Category</h1>
        <form [formGroup]="frm" (ngSubmit)="onSubmit()" class="create-product-form my-3">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" formControlName="name" />
            <div *ngIf="submitted">
              <div *ngIf="name.hasError('required')" class="inputError">Name is required</div>
              <div *ngIf="name.hasError('maxlength')" class="inputError">Name must be less than 50 characters</div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      *:focus {
        box-shadow: none !important;
      }
      .inputError {
        color: chocolate;
        font-size: 12px;
      }
    `,
  ],
})
export class CreateCategoryComponent {
  frm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private spinner: NgxSpinnerService, private categoryService: CategoryService) {
    this.frm = formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.frm.invalid) return;

    this.spinner.show();

    this.categoryService
      .create(this.name.value)
      .then(() => {
        this.toastr.success(`${this.name.value} kategorisi başarıyla oluşturuldu`, 'Başarılı');
        this.spinner.hide();
      })
      .catch((err) => {
        this.spinner.hide();
        this.toastr.error(err);
      });
  }

  get name() {
    return this.frm.get('name');
  }
}
