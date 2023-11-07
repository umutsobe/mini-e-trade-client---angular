import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { CreateProduct } from 'src/app/contracts/product/create_product';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Product } from 'src/app/contracts/product/list_product';
import { List_Product_Detail } from 'src/app/contracts/product/lis_product_detail';
import { List_Product_Admin } from 'src/app/contracts/product/list_Product_Admin';
import { Image } from 'src/app/contracts/product/image';
import { UpdateProduct } from 'src/app/contracts/product/update_product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClientService) {}

  async create(product: CreateProduct): Promise<CreateProduct> {
    const observable: Observable<CreateProduct> = this.http.post(
      {
        controller: 'Product',
        action: 'CreateProduct',
      },
      product
    );

    return await firstValueFrom(observable);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(
      {
        controller: 'Product',
        action: 'DeleteProductById',
      },
      id
    );
  }

  deleteImage(productId: string, imageId: string): Observable<any> {
    return this.http.delete(
      {
        action: 'DeleteImage',
        controller: 'Product',
        queryString: `imageId=${imageId}`, //apideki imageId ismi ile buradaki aynı olmak zorunda
      },
      productId
    );
  }

  async changeShowcaseImage(imageId: string, productId: string, successCallBack?: () => void): Promise<void> {
    const changeShowcaseImageObservable = this.http.get({
      controller: 'Product',
      action: 'ChangeShowcaseImage',
      queryString: `imageId=${imageId}&productId=${productId}`,
    });
    await firstValueFrom(changeShowcaseImageObservable);
    successCallBack();
  }

  async getCategoriesByProductId(productId: string): Promise<string[]> {
    const observable: Observable<string[]> = this.http.get(
      {
        controller: 'product',
        action: 'GetCategoriesByProduct',
      },
      productId
    );

    return await firstValueFrom(observable);
  }

  async assignCategoriesToProduct(productId: string, categoryNames: string[]): Promise<any> {
    const observable: Observable<any> = this.http.post(
      {
        controller: 'product',
        action: 'AssignCategoryToProduct',
      },
      { productId: productId, categoryNames: categoryNames }
    );

    return await firstValueFrom(observable);
  }

  async getProductsByFilter(filterQueryString: string): Promise<{ totalProductCount: number; products: List_Product[] }> {
    const observable: Observable<{ totalProductCount: number; products: List_Product[] }> = this.http.get({
      controller: 'product',
      action: 'GetProductsByFilter',
      queryString: `${filterQueryString}`,
    });

    return await firstValueFrom(observable);
  }

  async getProductByUrlId(urlId: string): Promise<List_Product_Detail> {
    const observable: Observable<List_Product_Detail> = this.http.get(
      {
        controller: 'product',
        action: 'GetProductByUrlIdRequest',
      },
      urlId
    );
    return await firstValueFrom(observable);
  }

  async getProductsByFilterAdmin(filterQueryString: string): Promise<{ totalProductCount: number; products: List_Product_Admin[] }> {
    const observable: Observable<{ totalProductCount: number; products: List_Product_Admin[] }> = this.http.get({
      controller: 'product',
      action: 'GetAllProductsAdmin',
      queryString: `${filterQueryString}`,
    });

    return await firstValueFrom(observable);
  }

  readImages(id: string): Observable<Image[]> {
    return this.http.get<Image[]>(
      {
        action: 'getproductimages',
        controller: 'product',
      },
      id
    );
  }
  async updateProduct(product: UpdateProduct): Promise<UpdateProduct> {
    const observable: Observable<UpdateProduct> = this.http.put(
      {
        controller: 'Product',
        action: 'UpdateProduct',
      },
      product
    );

    return await firstValueFrom(observable);
  }
}
