import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CreateUserAddress } from 'src/app/contracts/account/Address/CreateUserAddress';
import { ListUserAddresess } from 'src/app/contracts/account/Address/ListUserAddresess';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { AccountService } from 'src/app/services/models/account.service';

@Component({
  selector: 'app-addresess',
  template: `
    <h1 class="ms-2">My Addresess</h1>
    <button class="btn btn-warning ms-2 mb-2" data-bs-toggle="modal" data-bs-target="#roleModal">Create New Address</button>
    <div class="d-flex flex-wrap" style="margin-bottom: 500px;">
      <div *ngFor="let address of addresess" class="card m-2" style="width: 20rem;">
        <div class="card-body">
          <div class="d-flex justify-content-between mb-2">
            <h5 class="card-title fs-5">{{ addresess == null ? '' : address.definition }}</h5>
            <fa-icon role="button" class="fs-5 m-0" [icon]="faEllipsis" type="button" data-bs-toggle="dropdown" aria-expanded="false"></fa-icon>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" type="button" (click)="deleteAddress(address.id)">Sil</a></li>
            </ul>
          </div>
          <p class="card-text address-text">{{ addresess == null ? '' : address.address }}</p>
        </div>
      </div>
    </div>

    <!-- create address dialog -->

    <div class="modal fade" id="roleModal" tabindex="-1" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title" id="exampleModalLabel">Create New Address</h2>
          </div>
          <div class="modal-body d-flex justify-content-center">
            <form [formGroup]="frm" class="ms-5 w-50">
              <div class="mb-3">
                <label for="addressDefinition" class="form-label">Address Name</label>
                <input type="text" class="form-control" id="addressDefinition" formControlName="addressDefinition" />
                <div *ngIf="!addressDefinition.valid && (addressDefinition.dirty || addressDefinition.touched)" style="color:chocolate; font-size: 12px">Adres Adı zorunludur.</div>
              </div>

              <div class="mb-3">
                <label for="fullAddress" class="form-label">Full Address</label>
                <textarea rows="5" type="text" id="fullAddress" class="form-control" formControlName="fullAddress"></textarea>
                <div *ngIf="!fullAddress.valid && (fullAddress.dirty || fullAddress.touched)" style="color:chocolate; font-size: 12px;">Adres girişi zorunludur.</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button (click)="createAddress()" data-bs-dismiss="modal" [disabled]="!frm.valid" type="button" class="btn btn-primary">Create Address</button>
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

      .address-text {
        -webkit-line-clamp: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class AddresessComponent implements OnInit {
  faEllipsis = faEllipsis;

  addresess: ListUserAddresess[] = [];
  frm: FormGroup;

  constructor(private authService: AuthService, private toastr: ToastrService, private spinner: NgxSpinnerService, private accountService: AccountService, private formBuilder: FormBuilder) {
    this.frm = this.formBuilder.group({
      addressDefinition: ['', [Validators.required, Validators.maxLength(50)]],
      fullAddress: ['', [Validators.required, Validators.maxLength(400)]],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    await this.getAddresess();
  }

  async getAddresess() {
    this.addresess = await this.accountService
      .getUserAdresses(this.authService.UserId)
      .catch((err) => {
        this.spinner.hide();
        return [];
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  async createAddress() {
    this.spinner.show();

    const addressModel: CreateUserAddress = new CreateUserAddress();
    addressModel.address = this.fullAddress.value;
    addressModel.definition = this.addressDefinition.value;
    addressModel.userId = this.authService.UserId;

    this.accountService
      .createUserAddress(addressModel)
      .then(() => {
        this.toastr.success('Adres Başarıyla Eklendi');
        this.spinner.hide();
        this.getAddresess();
        this.addressDefinition.setValue('');
        this.fullAddress.setValue('');

        this.addressDefinition.reset();
        this.fullAddress.reset();
      })
      .catch((err) => {
        this.spinner.hide();
        this.toastr.error(err);
      });
  }

  async deleteAddress(addressId: string) {
    await this.accountService.deleteUserAddress(addressId);
    await this.getAddresess();
  }

  get addressDefinition() {
    return this.frm.get('addressDefinition');
  }
  get fullAddress() {
    return this.frm.get('fullAddress');
  }
}
