import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
import { Create_Order } from 'src/app/contracts/order/create_order';
import { OrderService } from 'src/app/services/models/order.service';
import { Create_Order_Item } from 'src/app/contracts/order/create_order_item';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CreateOrderResponse } from 'src/app/contracts/order/create-order-response';
import { Router } from '@angular/router';
import { Error_DTO } from 'src/app/contracts/error_dto';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-checkout',
  template: `
    <div class="container-sm p-0" style="margin-bottom: 400px;">
      <div *ngIf="spinnerElement && isBrowser" class="d-flex justify-content-center mt-3" style="width: 100%;">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div *ngIf="products.length > 0" class="mt-5 col-11 col-sm-11 col-md-10 col-lg-10 col-xl-10 container-sm p-0">
        <div class="d-flex flex-column flex-md-row">
          <div class="col-12 d-block col-md-8 col-lg-8 col-xl-9">
            <!-- sol -->
            <!-- addresses -->
            <div class="mb-4">
              <h1 class="m-0 p-0">1 - Shipping Address</h1>
              <div class="border rounded-2 p-3 mt-2">
                <a role="button" class="text-decoration-none mb-2" data-bs-toggle="modal" data-bs-target="#createAddressModal">Create New Address</a>
                <form class="mt-2">
                  <div *ngFor="let address of addresess" role="button" class="address-item border-top m-0 py-2 pe-1 ">
                    <div class="d-flex justify-content-between">
                      <h3 class="m-0 pe-2 w-100 d-flex" (click)="selectRadio(address)">{{ address.definition }}</h3>
                      <div class="px-1">
                        <fa-icon role="button" class="fs-5 m-0" [icon]="faEllipsis" type="button" data-bs-toggle="dropdown" aria-expanded="false"></fa-icon>
                        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
                          <li class="dropdown-item" type="button" (click)="deleteAddress(address.id)">Delete</li>
                        </ul>
                      </div>
                    </div>
                    <div class="d-flex align-items-center" (click)="selectRadio(address)">
                      <input type="radio" class="me-1 form-check-input" name="addressForm" style="min-width:14px! important" [id]="address.id" />
                      <div class="address">{{ address.address }}</div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <!-- card info -->
            <div>
              <h1 class="m-0 p-0">2 - Payment</h1>

              <div class="d-flex p-3 border rounded-3 justify-content-center mt-2">
                <form [formGroup]="paymentFrm" class="col-11 col-md-8 col-lg-5">
                  <!-- card number -->
                  <div class="mb-3">
                    <label for="cardNumber" class="form-label">Card Number</label>
                    <input (keyup)="cardInputChange($event)" type="text" class="form-control" id="cardNumber" formControlName="cardNumber" placeholder="**** **** **** ****" />
                    <div *ngIf="submitted">
                      <div *ngIf="cardNumber.hasError('required')" class="inputError">Card Number is required</div>
                    </div>
                  </div>
                  <!-- name -->
                  <div class="mb-3">
                    <label for="cardName" class="form-label">Full name on the card</label>
                    <input type="text" class="form-control" id="cardName" formControlName="cardName" />
                    <div *ngIf="submitted">
                      <div *ngIf="cardName.hasError('required')" class="inputError">Card Name is required</div>
                    </div>
                  </div>

                  <div class="mb-3 d-flex justify-content-between">
                    <div class="d-flex">
                      <!-- month -->
                      <div class="me-1" style="width: 55px;">
                        <input (input)="formatMonth($event)" type="number" class="form-control" id="expirationMonth" formControlName="expirationMonth" placeholder="MM" />
                        <div *ngIf="submitted">
                          <div *ngIf="expirationMonth.hasError('required')" class="inputError">Month is required</div>
                        </div>
                      </div>
                      <!-- year -->
                      <div class="m-0 p-0 mt-2 me-1 fs-4">/</div>
                      <div class="me-1" style="width: 55px;">
                        <input (input)="formatYear($event)" type="number" class="form-control" id="expirationYear" formControlName="expirationYear" placeholder="YY" />
                        <div *ngIf="submitted">
                          <div *ngIf="expirationYear.hasError('required')" class="inputError">Year is required</div>
                        </div>
                      </div>
                    </div>
                    <!-- security code -->
                    <div style="width: 70px;">
                      <input (input)="formatSecurityCode($event)" type="number" class="form-control" id="securityCode" formControlName="securityCode" placeholder="CVC" />
                      <div *ngIf="submitted">
                        <div *ngIf="securityCode.hasError('required')" class="inputError">Security code is required</div>
                      </div>
                    </div>
                  </div>
                  <div *ngIf="submitted">
                    <div *ngIf="!isExpirationDateValid()" class="inputError">Your card has expired</div>
                  </div>
                </form>
              </div>
            </div>
            <!-- Items -->
            <div class="mt-2 mt-md-3">
              <h1 class="m-0 p-0 mb-1">3 - Items</h1>
              <div class="d-flex p-3 border rounded-3">
                <div class="col-12 d-block col-md-7 col-lg-8 col-xl-8">
                  <div *ngFor="let product of products" class="d-flex my-2 py-2 border-bottom">
                    <div class="py-2">
                      <img style="height: 130px; object-fit: contain; border-radius: 10px;" src="/assets/product.webp" />
                    </div>
                    <div class="ms-2 ms-md-3 d-flex flex-column justify-content-between">
                      <h4 class="p-0 m-0 py-2">{{ product.name }}</h4>
                      <h2 class="m-0 p-0">{{ product.price | currency : 'USD' }}</h2>
                      <div class="d-flex justify-content-center align-items-center pb-2">
                        <div class="d-flex justify-content-center align-items-center p-1 rounded-2 border me-2">
                          <div type="button" (click)="minusQuantity(product)">
                            <fa-icon style="font-size: 18px;" class="me-1" [icon]="faMinus"></fa-icon>
                          </div>
                          <input readonly="readonly" value="{{ product.quantity }}" type="number" class="me-1 form-control text-center border-0 p-0 m-0" style="width: 20px" />
                          <div type="button" (click)="plusQuantity(product)">
                            <fa-icon style="font-size: 18px;" class="me-1" [icon]="faPlus"></fa-icon>
                          </div>
                        </div>
                        <div class="py-2 d-flex justify-content-center align-items-center" type="button" (click)="removeBasketItem(product.basketItemId)">
                          <fa-icon style="font-size: 18px;" class="me-2" [icon]="faTrash"></fa-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2 mt-md-5 ms-md-5 col-12 col-md-4 col-lg-4 col-xl-3 p-2 border mt-5 mt-md-0" style="border-radius: 10px; height: fit-content;">
            <!-- sağ -->
            <div class="p-1">
              <h2 class="m-0 p-0">Order Summary</h2>
              <div class="details pb-2 border-bottom">
                <div class="d-flex justify-content-between mt-1">
                  <div>Items</div>
                  <div>{{ products ? (totalPriceCalculate() - shippingCost | currency : 'USD') : '-' }}</div>
                </div>
                <div class="d-flex justify-content-between mt-1">
                  <div>Shipping cost</div>
                  <div>{{ this.shippingCost | currency : 'USD' }}</div>
                </div>
              </div>
              <div class="d-flex justify-content-between mt-1">
                <h2 class="m-0 p-0">Order total:</h2>
                <h2 class="m-0 p-0">{{ '$' + totalPriceCalculate && products ? (totalPriceCalculate() | currency : 'USD') : '-' }}</h2>
              </div>
              <button (click)="completeShopping()" class="mt-2 d-flex justify-content-center btn btn-warning w-100">Pay now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="!spinnerElement && isBrowser && products.length < 1">
      <div class="mt-4 d-flex justify-content-center" style="margin-bottom: 800px;">
        <div class="d-flex flex-column col-8 col-md-4">
          <div class="alert alert-info">Your card is empty.</div>
          <button routerLink="/search" class="btn btn-success mt-2">Continue shopping</button>
        </div>
      </div>
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
                  <div *ngIf="addressSubmitted">
                    <div *ngIf="addressDefinition.hasError('required')" class="inputError">Address Definition is required</div>
                    <div *ngIf="addressDefinition.hasError('maxlength')" class="inputError">Email must be less than 100 characters</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="fullAddress" class="form-label">Full Address</label>
                  <textarea rows="5" type="text" id="fullAddress" class="form-control" formControlName="fullAddress"></textarea>
                  <div *ngIf="addressSubmitted">
                    <div *ngIf="fullAddress.hasError('required')" class="inputError">Full Address is required</div>
                    <div *ngIf="fullAddress.hasError('maxlength')" class="inputError">Full Address must be less than 400 characters</div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="createAddress()" type="button" class="btn btn-primary">Create Address</button>
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
      .address-item:hover {
        opacity: 0.8;
      }
      .inputError {
        color: chocolate;
        font-size: 12px;
      }
    `,
  ],
})
export class CheckoutComponent implements OnInit {
  createAddressFrm: FormGroup;
  paymentFrm: FormGroup;
  submitted = false;
  addressSubmitted = false;
  faPlus = faPlus;
  faMinus = faMinus;
  faTrash = faTrash;
  isBrowser: boolean;

  faEllipsis = faEllipsis;
  constructor(private basketService: BasketService, private formBuilder: FormBuilder, private accountService: AccountService, private authService: AuthService, private toastr: ToastrService, private spinner: NgxSpinnerService, private orderService: OrderService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.createAddressFrm = this.formBuilder.group({
      addressDefinition: ['', [Validators.required, Validators.maxLength(50)]],
      fullAddress: ['', [Validators.required, Validators.maxLength(400)]],
    });

    this.paymentFrm = this.formBuilder.group({
      cardNumber: ['', [Validators.required]],
      cardName: ['', [Validators.required]],
      expirationMonth: ['', [Validators.required]],
      expirationYear: ['', [Validators.required]],
      securityCode: ['', [Validators.required]],
    });
  }

  spinnerElement: boolean = true;
  products: List_Basket_Item[] = [];

  async ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (isPlatformBrowser(this.platformId)) {
      this.products = await this.basketService.get();

      this.addresess = await this.accountService.getUserAdresses().catch((err) => {
        return [];
      });
    }

    this.spinnerElement = false;
  }

  //order items

  async minusQuantity(product: List_Basket_Item) {
    this.spinner.show();

    if (product.quantity == 1) {
      await this.removeBasketItem(product.basketItemId);
      return;
    } else {
      const _product: List_Basket_Item = new List_Basket_Item();
      _product.name = product.name;
      _product.basketItemId = product.basketItemId;
      _product.price = product.price;
      _product.quantity = product.quantity - 1;

      await this.basketService
        .updateQuantity(_product)
        .then(async () => {
          this.products = await this.basketService.get();
        })
        .finally(() => {
          this.spinner.hide();
        });
    }
  }

  plusQuantity(product: List_Basket_Item) {
    this.spinner.show();
    const _product: List_Basket_Item = new List_Basket_Item();

    _product.name = product.name;
    _product.basketItemId = product.basketItemId;
    _product.price = product.price;
    _product.quantity = product.quantity + 1;

    this.basketService
      .updateQuantity(_product)
      .then(async (response: Error_DTO) => {
        if (response.succeeded == false) {
          this.toastr.error(response.message);
        } else this.products = await this.basketService.get();
      })
      .finally(() => {
        this.spinner.hide();
      });
  }
  async removeBasketItem(basketItemId) {
    this.spinner.show();
    await this.basketService
      .remove(basketItemId)
      .then(async () => {
        this.products = await this.basketService.get();
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  shippingCost: number = 5;
  totalPriceCalculate() {
    let totalPrice = 0;
    for (let i = 0; i < this.products.length; i++) {
      totalPrice = totalPrice + this.products[i].price * this.products[i].quantity;
    }
    return totalPrice + this.shippingCost;
  }

  async completeShopping() {
    // this.spinner.show();
    this.submitted = true;
    if (this.selectedAddress == undefined) {
      this.toastr.error('You must select an address.');
      return;
    }
    if (this.paymentFrm.invalid) {
      this.toastr.error('Check the inputs');
      return;
    }
    if (!this.isExpirationDateValid()) {
      this.toastr.error('Your card has expired');
      return;
    }

    const order: Create_Order = new Create_Order();

    order.address = this.selectedAddress.address;
    order.description = '....';
    order.orderItems = this.convertBasketItemsToOrderItems(this.products);

    await this.orderService
      .create(order)
      .then((response: CreateOrderResponse) => {
        if (response.succeeded == false) {
          this.toastr.error(response.message);
        } else {
          this.router.navigateByUrl(`success-order/${response.orderCode}`);
        }

        this.spinner.hide();
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  cardNumberValidation(): boolean {
    const regexString = '^[0-9]{13,16}$'; // Sadece rakamlardan oluşan 13 ile 16 karakter uzunluğunda bir kart numarası

    const cardNumberInput: string = this.cardNumber.value;
    const cardNumber: string = cardNumberInput.replace(/\D/g, ''); // Rakam dışındaki tüm karakterleri kaldır

    const regex = new RegExp(regexString);

    const isValid = regex.test(cardNumber);

    return isValid;
  }

  orderValidation(): boolean {
    if (this.paymentFrm.valid && this.selectedAddress && this.cardNumberValidation() == true) return false;
    else return true;
  }

  convertBasketItemsToOrderItems(basketItems: List_Basket_Item[]): Create_Order_Item[] {
    const orderItems: Create_Order_Item[] = [];

    for (const basketItem of basketItems) {
      const orderItem: Create_Order_Item = {
        productId: basketItem.productId,
        quantity: basketItem.quantity,
        price: basketItem.price,
      };

      orderItems.push(orderItem);
    }

    return orderItems;
  }

  //address
  addresess: ListUserAddresess[] = [];
  selectedAddress: ListUserAddresess;

  selectAddress(address: ListUserAddresess) {
    this.selectedAddress = address;
  }

  selectRadio(address: ListUserAddresess) {
    // Burada ilgili radyo düğmesini işaretleyebilirsiniz
    // Örnek olarak, bu radyo düğmesini seçili hale getirin:
    this.selectedAddress = address;

    if (typeof document !== 'undefined') {
      const selectedRadio = document.getElementById(address.id.toString()) as HTMLInputElement;
      if (selectedRadio) {
        selectedRadio.checked = true;
      }
    }
  }

  async getAddresess() {
    this.addresess = await this.accountService
      .getUserAdresses()
      .catch((err) => {
        this.spinner.hide();
        return [];
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  async createAddress() {
    this.addressSubmitted = true;
    if (this.createAddressFrm.invalid) return;

    this.spinner.show();
    const addressModel: CreateUserAddress = new CreateUserAddress();
    addressModel.address = this.fullAddress.value;
    addressModel.definition = this.addressDefinition.value;

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

  formatCardNumber(cardInput: string): string {
    const value = cardInput
      .trim()
      .replace(/[^0-9]/g, '')
      .slice(0, 16);
    const formattedValue = value.replace(/(\d{4}(?=\d))/g, '$1 ');
    return formattedValue;
  }
  cardInputChange(event: any) {
    const inputValue: string = event.target.value;
    const formattedValue: string = this.formatCardNumber(inputValue);
    this.cardNumber.setValue(formattedValue);
  }

  isExpirationDateValid(): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() - 2000;
    const currentMonth = currentDate.getMonth() + 1;

    const cardYear = parseInt(this.expirationYear.value);
    const cardMonth = parseInt(this.expirationMonth.value);

    if (cardYear >= currentYear && (cardYear !== currentYear || cardMonth >= currentMonth) && cardMonth >= 1 && cardMonth <= 12) {
      return true; //valid
    }

    return false; // valid değil
  }

  formatYear(event) {
    let inputValue: string = event.target.value;
    let formattedValue = '';

    if (inputValue.length > 2) formattedValue = inputValue.slice(0, 2);
    else formattedValue = inputValue;

    this.expirationYear.setValue(formattedValue);
  }
  formatMonth(event) {
    let inputValue: string = event.target.value;
    let formattedValue = '';

    if (inputValue.length > 2) formattedValue = inputValue.slice(0, 2);
    else formattedValue = inputValue;

    this.expirationMonth.setValue(formattedValue);
  }
  formatSecurityCode(event) {
    let inputValue: string = event.target.value;
    let formattedValue = '';

    if (inputValue.length > 3) formattedValue = inputValue.slice(0, 3);
    else formattedValue = inputValue;

    this.securityCode.setValue(formattedValue);
  }
  //#endregion

  //#region form gets
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
  get expirationMonth() {
    return this.paymentFrm.get('expirationMonth');
  }
  get expirationYear() {
    return this.paymentFrm.get('expirationYear');
  }
  get securityCode() {
    return this.paymentFrm.get('securityCode');
  }
  //#endregion
}
