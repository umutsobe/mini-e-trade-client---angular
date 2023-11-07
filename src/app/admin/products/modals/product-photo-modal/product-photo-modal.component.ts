import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { List_Product } from 'src/app/contracts/product/list_product';
import { ProductService } from 'src/app/services/models/product.service';
import { Image } from 'src/app/contracts/product/image';
import { IdExchangeService } from 'src/app/services/data-exchange/id-exchange.service';

@Component({
  selector: 'app-product-photo-modal',
  template: `
    <div class="modal fade" id="selectPhotoModal" data-bs-config="{backdrop:true}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Add Product Photo</h1>
            <div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          </div>
          <p class="ms-3 mt-2">Product Id: {{ selectedProduct ? selectedProduct.id : '' }}</p>
          <p class="ms-3 mt-2">Product Name: {{ selectedProduct ? selectedProduct.name : '' }}</p>
          <div class="modal-body">
            <h4 class="text-center">Add Photo to Product</h4>
            <app-file-upload [definition]="'product'"></app-file-upload>
            <!-- appfilecomponent child componenttir bu componentte göre -->
          </div>
          <div class="list-images">
            <h4 class="text-center">Product Photos</h4>
            <div class="d-flex flex-wrap justify-content-center">
              <div *ngFor="let productImage of productImages" class="card m-1" style="width:11rem">
                <span class="my-1 d-flex justify-content-center">
                  Showcase
                  <input [checked]="productImage.showcase === true" class="ms-1 my-1 form-check-input" type="radio" name="img" (click)="showCase(productImage.id)" />
                </span>

                <img style="height: 20vh; object-fit: contain;" src="{{ productImage.path }}" class="card-img-top" />
                <div class="card-body text-center">
                  <button (click)="deleteImage(selectedProduct.id, productImage.id)" class="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" (click)="closeModal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProductPhotoModalComponent implements OnInit {
  @Input() selectedProduct: List_Product = { id: '' };
  productImages: Image[];
  isComponentLoaded = false;

  constructor(private spinner: NgxSpinnerService, private productService: ProductService, private idService: IdExchangeService) {}

  ngOnInit(): void {
    this.idService.setId(this.selectedProduct.id); // file upload componentin hangi id ile işlem yapacağını söylüyor
  }

  deleteImage(productId: string, imageId: string) {
    this.spinner.show();
    this.productService.deleteImage(productId, imageId).subscribe(
      () => {
        this.spinner.hide();
        this.listProductPhotos(productId);
      },
      () => {
        this.spinner.hide();
      }
    );
    this.spinner.hide();
  }

  listProductPhotos(id: string) {
    this.isComponentLoaded = true;
    this.spinner.show();

    if (this.isComponentLoaded) {
      this.productService.readImages(id).subscribe(
        (response) => {
          this.productImages = response;
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }
  showCase(imageId: string) {
    this.spinner.show();

    this.productService.changeShowcaseImage(imageId, this.selectedProduct.id as string, () => {
      this.spinner.hide();
    });
  }

  closeModal() {
    this.selectedProduct.id = '';
  }
}
