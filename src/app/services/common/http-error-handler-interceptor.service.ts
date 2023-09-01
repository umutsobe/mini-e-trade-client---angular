import { HttpEvent, HttpHandler, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerInterceptorService {
  constructor(private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            this.toastr.warning('Bu işlemi yapmaya yetkiniz bulunmamaktadır!', 'Yetkisiz işlem!');

            break;
          case HttpStatusCode.InternalServerError:
            this.toastr.warning('Sunucuya erişilmiyor!', 'Sunucu hatası!');

            break;
          case HttpStatusCode.BadRequest:
            break;
          case HttpStatusCode.NotFound:
            this.toastr.warning('Sayfa bulunamadı!', 'Sayfa bulunamadı!');

            break;
          default:
            this.toastr.warning('Beklenmeyen bir hata meydana geldi!', 'Hata!');

            break;
        }
        return of(error);
      })
    );
  }
}
