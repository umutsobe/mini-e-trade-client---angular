import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from 'src/app/services/models/role.service';

@Component({
  selector: 'app-create-role',
  template: `
    <div class="d-flex justify-content-center mt-2">
      <div class="col-11 col-sm-9 col-md-8 col-lg-5">
        <div style="padding: 10px;">
          <h1 class=" mt-2 text-center ">Create Role</h1>
          <form [formGroup]="frm" (ngSubmit)="onSubmit()" class="create-product-form my-3">
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-control" id="name" formControlName="name" />
              <div *ngIf="submitted">
                <div *ngIf="name.hasError('required')" class="inputError">Name is required</div>
                <div *ngIf="name.hasError('maxlength')" class="inputError">Name must be less than 150 characters</div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
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
export class CreateRoleComponent {
  frm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private roleService: RoleService, private toastr: ToastrService, private spinner: NgxSpinnerService) {
    this.frm = formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.frm.invalid) return;

    this.spinner.show();

    this.roleService
      .create(this.name.value)
      .then(() => {
        this.toastr.success(`${this.name.value} rolü başarıyla oluşturuldu`, 'Başarılı');
        this.spinner.hide();
      })
      .catch((err) => {
        this.spinner.hide();
      });
  }

  get name() {
    return this.frm.get('name');
  }
}
