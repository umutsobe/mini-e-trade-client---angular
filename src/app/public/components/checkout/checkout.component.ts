import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CreateUserAddress } from 'src/app/contracts/account/Address/CreateUserAddress';
import { ListUserAddresess } from 'src/app/contracts/account/Address/ListUserAddresess';
import { List_Basket_Item } from 'src/app/contracts/basket/list_basket_item';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { AccountService } from 'src/app/services/models/account.service';
import { BasketService } from 'src/app/services/models/basket.service';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
declare let $: any;

@Component({
  selector: 'app-checkout',
  template: `
    <div class="container-sm p-0" style="margin-bottom: 800px;">
      <div *ngIf="products.length > 0" class="mt-5 col-11 col-sm-11 col-md-10 col-lg-10 col-xl-10 container-sm p-0">
        <div class="d-flex flex-column flex-md-row">
          <div class="col-12 d-block col-md-8 col-lg-8 col-xl-9">
            <!-- sol -->
            <!-- address -->
            <div class="mb-4">
              <h1 class="m-0 p-0">1 Shipping Address</h1>
              <div class="border rounded-2 p-3 mt-2">
                <a role="button" class="text-decoration-none mb-2" data-bs-toggle="modal" data-bs-target="#createAddressModal">Create New Address</a>
                <form class="mt-2">
                  <div *ngFor="let address of addresess" class="border-top m-0 py-2 pe-1">
                    <div class="d-flex justify-content-between">
                      <h3 class="m-0 pe-2 w-100 d-flex">{{ address.definition }}</h3>
                      <div>
                        <fa-icon role="button" class="fs-5 m-0" [icon]="faEllipsis" type="button" data-bs-toggle="dropdown" aria-expanded="false"></fa-icon>
                        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
                          <li class="dropdown-item" type="button" (click)="deleteAddress(address.id)">Delete</li>
                        </ul>
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                      <input (click)="selectAdsress(address)" type="radio" class="me-1 form-check-input" name="addressForm" style="min-width:14px! important" [id]="address.id" />
                      <div class="address">{{ address.address }}</div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div>
              <h1 class="m-0 p-0">2 Payment</h1>

              <div class="d-flex p-3 border rounded-3 justify-content-center mt-2">
                <form [formGroup]="paymentFrm" class="col-11 col-md-8 col-lg-5">
                  <div class="mb-3">
                    <label for="cardNumber" class="form-label">Card Number</label>
                    <input (input)="cardInputChange($event)" type="text" class="form-control" id="cardNumber" formControlName="cardNumber" placeholder="**** **** **** ****" />
                    <div *ngIf="!cardNumber.valid && (cardNumber.dirty || cardNumber.touched)" style="color:chocolate; font-size: 12px;">Card Number is required</div>
                  </div>

                  <div class="mb-3">
                    <label for="cardName" class="form-label">Full name on the card</label>
                    <input type="text" class="form-control" id="cardName" formControlName="cardName" />
                    <div *ngIf="!cardName.valid && (cardName.dirty || cardName.touched)" style="color:chocolate; font-size: 12px;">Card Name is required</div>
                  </div>

                  <div class="mb-3 d-flex">
                    <div class="me-2">
                      <label for="expirationDate" class="form-label">Expiration Date</label>
                      <input type="text" class="form-control" id="expirationDate" formControlName="expirationDate" />
                      <div *ngIf="!expirationDate.valid && (expirationDate.dirty || expirationDate.touched)" style="color:chocolate; font-size: 12px;">Expiration Date is required</div>
                    </div>

                    <div>
                      <label for="securityCode" class="form-label">Security Code</label>
                      <input type="text" class="form-control" id="securityCode" formControlName="securityCode" />
                      <div *ngIf="!securityCode.valid && (securityCode.dirty || securityCode.touched)" style="color:chocolate; font-size: 12px;">Security Code is required</div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="ms-md-5 col-12 col-md-4 col-lg-4 col-xl-3 p-2 border mt-5 mt-md-0" style="border-radius: 10px; height: fit-content;">
            <!-- sağ -->
            <div class="p-1">
              <h2 class="m-0 p-0">Order Summary</h2>
              <div class="details pb-2 border-bottom">
                <div class="d-flex justify-content-between mt-1">
                  <div>Items</div>
                  <div>20$</div>
                </div>
                <div class="d-flex justify-content-between mt-1">
                  <div>Shipping cost</div>
                  <div>5$</div>
                </div>
              </div>
              <div class="d-flex justify-content-between mt-1">
                <h2 class="m-0 p-0">Order total:</h2>
                <h2 class="m-0 p-0">25$</h2>
              </div>
              <button class="mt-2 d-flex justify-content-center btn btn-warning w-100">Complete Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="!spinnerElement && !(products == null ? false : products.length > 0)" class="mt-4 d-flex flex-column align-items-center">
      <div class="alert alert-info col-8">Your card is empty.</div>
      <button routerLink="/search" class="btn btn-success mt-2">Continue shopping</button>
    </div>

    <!-- create address dialog -->

    <div class="modal fade" id="createAddressModal" tabindex="-1" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg d-flex justify-content-center">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title" id="exampleModalLabel">Create New Address</h2>
          </div>
          <div class="modal-body d-flex justify-content-center">
            <div class="col-12  ">
              <form [formGroup]="createAddressFrm">
                <div class="mb-3">
                  <label for="addressDefinition" class="form-label">Address Name</label>
                  <input type="text" class="form-control" id="addressDefinition" formControlName="addressDefinition" />
                  <div *ngIf="!addressDefinition.valid && (addressDefinition.dirty || addressDefinition.touched)" style="color:chocolate; font-size: 12px">Address Name is required.</div>
                </div>

                <div class="mb-3">
                  <label for="fullAddress" class="form-label">Full Address</label>
                  <textarea rows="5" type="text" id="fullAddress" class="form-control" formControlName="fullAddress"></textarea>
                  <div *ngIf="!fullAddress.valid && (fullAddress.dirty || fullAddress.touched)" style="color:chocolate; font-size: 12px;">Address is required.</div>
                </div>
              </form>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="createAddress()" data-bs-dismiss="modal" [disabled]="!createAddressFrm.valid" type="button" class="btn btn-primary">Create Address</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .address {
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      *:focus {
        box-shadow: none !important;
      }
      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    `,
  ],
})
export class CheckoutComponent implements OnInit {
  createAddressFrm: FormGroup;
  paymentFrm: FormGroup;
  faEllipsis = faEllipsis;
  constructor(private basketService: BasketService, private formBuilder: FormBuilder, private accountService: AccountService, private authService: AuthService, private toastr: ToastrService, private spinner: NgxSpinnerService) {
    this.createAddressFrm = this.formBuilder.group({
      addressDefinition: ['', [Validators.required, Validators.maxLength(50)]],
      fullAddress: ['', [Validators.required, Validators.maxLength(400)]],
    });

    this.paymentFrm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.maxLength(19)]],
      cardName: ['', [Validators.required]],
      expirationDate: ['', [Validators.required]],
      securityCode: ['', [Validators.required]],
    });
  }
  spinnerElement: boolean = false;
  products: List_Basket_Item[] = [];

  async ngOnInit() {
    this.products = await this.basketService.get();

    this.addresess = await this.accountService.getUserAdresses(this.authService.UserId).catch((err) => {
      return [];
    });

    this.spinnerElement = false;
  }

  //address
  addresess: ListUserAddresess[] = [];
  selectedAddress: ListUserAddresess;

  selectAdsress(address: ListUserAddresess) {
    this.selectedAddress = address;
    debugger;
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
        this.toastr.success('Address Successfully Added');
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

  //adres form
  get addressDefinition() {
    return this.createAddressFrm.get('addressDefinition');
  }
  get fullAddress() {
    return this.createAddressFrm.get('fullAddress');
  }

  // payment form
  get cardNumber() {
    return this.paymentFrm.get('cardNumber');
  }
  get cardName() {
    return this.paymentFrm.get('cardName');
  }
  get expirationDate() {
    return this.paymentFrm.get('expirationDate');
  }
  get securityCode() {
    return this.paymentFrm.get('securityCode');
  }

  //
  cardInputChange(event: any) {
    const keyboardEvent = event as KeyboardEvent;
    let isBackspaceKey: boolean = false;
    if (keyboardEvent.key === 'Backspace') {
      isBackspaceKey = true;
    }
    let inputValue: string = event.target.value;
    inputValue = inputValue.replace(/[^0-9\s]/g, '');
    let inputValueLength: number = inputValue.length;
    let formattedValue = '';
    if (inputValueLength <= 19) {
      if ((inputValueLength == 4 || inputValueLength == 9 || inputValueLength == 14) && !isBackspaceKey) {
        formattedValue += inputValue + ' ';
      } else {
        formattedValue = inputValue;
      }
    } else {
      formattedValue = inputValue.slice(0, 19);
    }
    this.cardNumber.setValue(formattedValue);
  }
}
