import { Component, Inject, Input, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { List_Product } from 'src/app/contracts/product/list_product';
import { ProductService } from 'src/app/services/models/product.service';
import { ListComponent } from '../../list/list.component';

@Component({
  selector: 'app-product-delete-modal',
  template: `
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Product Deletion Process</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-danger">Product deletion process is irreversible!!!</p>
            <p>Product to be deleted: {{ selectedProduct ? selectedProduct.name : '' }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button (click)="delete()" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProductDeleteModalComponent {
  @Input() selectedProduct: List_Product;

  constructor(private productService: ProductService, private spinner: NgxSpinnerService, private toastr: ToastrService, @Inject(ListComponent) private adminProductListComponent: ListComponent) {}

  async delete() {
    this.spinner.show();
    this.productService.delete(this.selectedProduct.id).subscribe(
      async () => {
        this.spinner.hide();
        this.toastr.success('Product Successfully Deleted');
        await this.adminProductListComponent.getProducts();
      },
      () => this.spinner.hide(),
      () => this.spinner.hide()
    );
    this.spinner.hide();
  }
}
