import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { CreateProduct } from 'src/app/contracts/create_product';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Product } from 'src/app/contracts/list_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Product_Image } from 'src/app/contracts/list_product_image';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClientService) {}

  create(product: CreateProduct): Observable<CreateProduct> {
    return this.http.post(
      {
        controller: 'ProductControllers',
      },
      product
    );
  }

  read(page: number = 0, size: number = 5, successCallback?: () => void, errorCallback?: (errorMessage: string) => void): Promise<{ totalProductCount: number; products: List_Product[] }> {
    const promiseData: Promise<{ totalProductCount: number; products: List_Product[] }> = this.http
      .get<{ totalProductCount: number; products: List_Product[] }>({
        controller: 'productControllers',
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
}
