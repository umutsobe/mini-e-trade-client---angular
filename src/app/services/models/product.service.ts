import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { CreateProduct } from 'src/app/contracts/product/create_product';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Product } from 'src/app/contracts/product/list_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Product_Image } from 'src/app/contracts/product/list_product_image';
import { ProductFilter } from 'src/app/contracts/product/filter_product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClientService) {}

  async create(product: CreateProduct): Promise<CreateProduct> {
    const observable: Observable<CreateProduct> = this.http.post(
      {
        controller: 'ProductControllers',
        action: 'CreateProduct',
      },
      product
    );

    return await firstValueFrom(observable);
  }

  read(page: number = 0, size: number = 5, successCallback?: () => void, errorCallback?: (errorMessage: string) => void): Promise<{ totalProductCount: number; products: List_Product[] }> {
    const promiseData: Promise<{ totalProductCount: number; products: List_Product[] }> = this.http
      .get<{ totalProductCount: number; products: List_Product[] }>({
        controller: 'productControllers',
        action: 'GetAllProducts',
        queryString: `page=${page}&size=${size}`,
      })
      .toPromise();

    promiseData.then((d) => successCallback()).catch((errorResponse: HttpErrorResponse) => errorCallback(errorResponse.message));
    return promiseData;
  }

  delete(id: string): Observable<any> {
    return this.http.delete(
      {
        controller: 'ProductControllers',
        action: 'DeleteProductById',
      },
      id
    );
  }

  readImages(id: string): Observable<List_Product_Image[]> {
    return this.http.get<List_Product_Image[]>(
      {
        action: 'getproductimages',
        controller: 'productcontrollers',
      },
      id
    );
  }

  deleteImage(productId: string, imageId: string): Observable<any> {
    return this.http.delete(
      {
        action: 'DeleteImage',
        controller: 'ProductControllers',
        queryString: `imageId=${imageId}`, //apideki imageId ismi ile buradaki aynı olmak zorunda
      },
      productId
    );
  }

  async changeShowcaseImage(imageId: string, productId: string, successCallBack?: () => void): Promise<void> {
    const changeShowcaseImageObservable = this.http.get({
      controller: 'ProductControllers',
      action: 'ChangeShowcaseImage',
      queryString: `imageId=${imageId}&productId=${productId}`,
    });
    await firstValueFrom(changeShowcaseImageObservable);
    successCallBack();
  }

  async getCategoriesByProductId(productId: string): Promise<string[]> {
    const observable: Observable<string[]> = this.http.get(
      {
        controller: 'productControllers',
        action: 'GetCategoriesByProduct',
      },
      productId
    );

    return await firstValueFrom(observable);
  }

  async assignCategoriesToProduct(productId: string, categoryNames: string[]): Promise<any> {
    const observable: Observable<any> = this.http.post(
      {
        controller: 'productControllers',
        action: 'AssignCategoryToProduct',
      },
      { productId: productId, categoryNames: categoryNames }
    );

    return await firstValueFrom(observable);
  }

  async getProductsByFilter(filterQueryString: string): Promise<{ totalProductCount: number; products: List_Product[] }> {
    const observable: Observable<{ totalProductCount: number; products: List_Product[] }> = this.http.get({
      controller: 'productControllers',
      action: 'GetProductsByFilter',
      queryString: `${filterQueryString}`,
    });

    return await firstValueFrom(observable);
  }
}
