import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from 'src/app/services/models/role.service';

@Component({
  selector: 'app-create-role',
  template: `
    <div class="w-50 mx-auto">
      <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px;">
        <h1 class=" mt-2 text-center ">Create Role</h1>
        <form [formGroup]="frm" (ngSubmit)="onSubmit()" class="create-product-form my-3">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" formControlName="name" />
            <div *ngIf="!name.valid && (name.dirty || name.touched)" style="color:chocolate; font-size: 12px;">İsim girişi zorunludur</div>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="!frm.valid">Submit</button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      *:focus {
        box-shadow: none !important;
      }
    `,
  ],
})
export class CreateRoleComponent {
  frm: FormGroup;
  constructor(private formBuilder: FormBuilder, private roleService: RoleService, private toastr: ToastrService, private spinner: NgxSpinnerService) {
    this.frm = formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  onSubmit() {
    this.spinner.show();

    this.roleService
      .create(this.name.value)
      .then(() => {
        this.toastr.success(`${this.name.value} rolü başarıyla oluşturuldu`, 'Başarılı');
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
