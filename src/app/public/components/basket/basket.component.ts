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
    <div *ngIf="products.length > 0" class="mx-5 mt-5 row" style="margin-bottom: 700px;">
      <div class="col-8">
        <h1 class="">Sepetim</h1>

        <div *ngFor="let product of products" class="row my-2 py-2" style="border-top: 1px solid gray;">
          <!-- iterasyon burada olacak -->
          <div class="col-4 py-2 d-flex justify-content-center align-items-center">
            <img width="175px" src="/assets/product.jpg" style="border-radius: 10px;" />
          </div>
          <div class="col-2 py-2 d-flex justify-content-center align-items-center">{{ product.name }}</div>
          <div class="col-2 py-2 d-flex justify-content-center align-items-center">{{ product.price }}</div>
          <div class="col-3 py-2 d-flex justify-content-center align-items-center">
            <!-- quantity -->

            <div type="button" (click)="minusQuantity(product)">
              <fa-icon class="fs-5 me-2" [icon]="faMinus"></fa-icon>
            </div>

            <input readonly="readonly" value="{{ product.quantity }}" type="number" id="quantityInput" class="form-control w-25" style="box-shadow: none;width: max-content; " />
            <div type="button" (click)="plusQuantity(product)">
              <fa-icon class="fs-5 ms-2" [icon]="faPlus"></fa-icon>
            </div>
          </div>
          <div class="col-1 py-2 d-flex justify-content-center align-items-center">
            <!-- remove -->
            <div type="button" (click)="removeBasketItem(product.basketItemId)">
              <fa-icon class="fs-5 me-2" [icon]="faTrash"></fa-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="col-3 ms-3 mt-4" style="border-radius: 10px; height: 500px;">
        <!-- <h2 class="d-flex justify-content-center mt-2" style="font-weight: 500;">Checkout</h2> -->
        <div style="" class="d-flex justify-content-center">
          <h2>Ara Toplam:</h2>
          <h2 class="ms-4">
            {{ totalPriceCalculate && products ? totalPriceCalculate() : '-' }}
          </h2>
        </div>
        <button (click)="completeShopping()" class="btn mt-3" style="background-color: #f7ca00; color: black; font-size: 15px; width: 100%;">Alışverişi Tamamla</button>
      </div>
    </div>

    <div *ngIf="!(products.length > 0)" class="container mt-5 w-50" style="margin-bottom: 800px;">
      <div class="alert alert-info ">Sepetinizde ürün yok.</div>
      <button routerLink="/search" class="btn btn-success mt-2">Alışverişe devam edin</button>
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
    `,
  ],
})
export class BasketComponent implements OnInit {
  faPlus = faPlus;
  faMinus = faMinus;
  faTrash = faTrash;
  products: List_Basket_Item[] = [];
  constructor(private spinner: NgxSpinnerService, private basketService: BasketService, private toastr: ToastrService, private orderService: OrderService, private userService: UserService) {}
  ngOnInit() {
    this.spinner.show();
    this.basketService.get().subscribe(
      (response) => {
        this.products = response;
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
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
