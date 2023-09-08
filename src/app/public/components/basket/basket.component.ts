import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { BasketService } from 'src/app/services/models/basket.service';
import { List_Basket_Item } from 'src/app/contracts/basket/list_basket_item';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/models/order.service';
import { Create_Order } from 'src/app/contracts/order/create_order';
import { UserService } from 'src/app/services/models/user.service';
import { Create_Order_Item } from 'src/app/contracts/order/create_order_item';

declare var $: any;

@Component({
  selector: 'app-basket',
  template: `
    <div class="container-sm p-0" style="margin-bottom: 600px;">
      <div *ngIf="products.length > 0" class="mt-5 col-11 col-sm-11 col-md-10 col-lg-10 col-xl-10 container-sm p-0">
        <div class="d-flex flex-column flex-md-row">
          <div class="col-12 d-block col-md-7 col-lg-8 col-xl-8">
            <h1 class="">Sepetim</h1>
            <div *ngIf="spinnerElement" class="ms-4 spinner-border text-primary" role="status"></div>

            <div *ngFor="let product of products" class="d-flex my-2 py-2 border-top">
              <div class="py-2">
                <img style="height: 130px; object-fit: contain; border-radius: 10px;" src="/assets/product.jpg" />
              </div>

              <div class="ms-3 d-flex flex-column justify-content-between">
                <div class="py-2">{{ product.name }}</div>
                <h2 class="m-0 p-0">{{ product.price + ' TL' }}</h2>
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
          <div class="ms-md-5 col-12 col-md-5 col-lg-4 col-xl-4 p-2 border mt-5" style="border-radius: 10px; height: fit-content;">
            <div class="d-flex justify-content-center">
              <h2 class="m-0 p-0">Ara Toplam:</h2>
              <h2 class="m-0 p-0 ms-2">
                {{ (totalPriceCalculate && products ? totalPriceCalculate() : '-') + ' TL' }}
              </h2>
            </div>
            <button (click)="completeShopping()" class="btn mt-3 btn-lg" style="background-color: #f7ca00; color: black; font-size: 15px; width: 100%;">Alışverişi Tamamla</button>
          </div>
        </div>
      </div>

      <div *ngIf="!(products == null ? false : products.length > 0) && !spinnerElement" class="mt-4 d-flex flex-column align-items-center">
        <div class="alert alert-info col-8">Sepetinizde ürün yok.</div>
        <button routerLink="/search" class="btn btn-success mt-2">Alışverişe devam edin</button>
      </div>
    </div>
  `,
  styles: [
    `
      /* number inputlardan arrow kaldırma */
      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      *:focus {
        box-shadow: none !important;
      }
    `,
  ],
})
export class BasketComponent implements OnInit {
  faPlus = faPlus;
  faMinus = faMinus;
  faTrash = faTrash;
  products: List_Basket_Item[] = [];
  spinnerElement: boolean = true;

  constructor(private spinner: NgxSpinnerService, private basketService: BasketService, private toastr: ToastrService, private orderService: OrderService, private userService: UserService) {}
  ngOnInit() {
    this.basketService.get().subscribe(
      (response) => {
        this.products = response;
        this.spinnerElement = false;
      },
      () => {}
    );
  }
  async minusQuantity(product: List_Basket_Item) {
    this.spinner.show();

    if (product.quantity == 1) {
      await this.removeBasketItem(product.basketItemId);
      return;
    } else {
      let _product: List_Basket_Item = new List_Basket_Item();
      _product.name = product.name;
      _product.basketItemId = product.basketItemId;
      _product.price = product.price;
      _product.quantity = product.quantity - 1;

      await this.basketService
        .updateQuantity(_product)
        .then(() => {
          this.basketService.get().subscribe((response) => {
            this.totalPriceCalculate();
            this.products = response;
          });
        })
        .finally(() => {
          this.spinner.hide();
        });
    }
  }

  plusQuantity(product: List_Basket_Item) {
    this.spinner.show();
    let _product: List_Basket_Item = new List_Basket_Item();

    _product.name = product.name;
    _product.basketItemId = product.basketItemId;
    _product.price = product.price;
    _product.quantity = product.quantity + 1;

    this.basketService
      .updateQuantity(_product)
      .then(() => {
        this.basketService.get().subscribe((response) => {
          this.products = response;
        });
      })
      .finally(() => {
        this.spinner.hide();
      });
  }
  async removeBasketItem(basketItemId) {
    this.spinner.show();
    await this.basketService
      .remove(basketItemId)
      .then(() => {
        this.basketService.get().subscribe((response) => {
          this.products = response;
        });
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  totalPriceCalculate() {
    let totalPrice: number = 0;
    for (let i = 0; i < this.products.length; i++) {
      totalPrice = totalPrice + this.products[i].price * this.products[i].quantity;
    }
    return totalPrice;
  }

  async completeShopping() {
    this.spinner.show();
    let order: Create_Order = new Create_Order();

    order.address = 'ankara kızılay';
    order.description = '....';
    order.userId = this.userService.getUserId();
    order.orderItems = this.convertBasketItemsToOrderItems(this.products);

    await this.orderService
      .create(order)
      .then(() => {
        this.basketService.get().subscribe(
          //wdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa order verme sayfası yaptığında burayı sil
          (response) => {
            this.products = response;
            this.spinner.hide();
          },
          () => {
            this.spinner.hide();
          }
        );
        this.spinner.hide();
        this.toastr.success('Siparişiniz Başarıyla Oluşturuldu', 'Başarılı');
      })
      .finally(() => {
        this.spinner.hide();
      });
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
}
