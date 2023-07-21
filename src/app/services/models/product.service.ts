import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { CreateProduct } from 'src/app/contracts/create_product';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Product } from 'src/app/contracts/list_product';
import { HttpErrorResponse } from '@angular/common/http';

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

  read(page: number = 0, size: number = 5, successCallback?: () => void, errorCallback?: (errorMessage: string) => void): Promise<{ totalCount: number; products: List_Product[] }> {
    const promiseData: Promise<{ totalCount: number; products: List_Product[] }> = this.http
      .get<{ totalCount: number; products: List_Product[] }>({
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
}
