import { HttpEvent, HttpHandler, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerInterceptorService {
  constructor(private toastr: ToastrService) {}

  // app module providersa bak
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            this.toastr.warning('You are not authorized to perform this operation');
            break;

          case HttpStatusCode.InternalServerError:
            this.toastr.warning('Cannot access the server!');
            break;

          case HttpStatusCode.NotFound:
            this.toastr.warning('Cannot access the server!');
            break;

          default:
            this.toastr.warning('An unexpected error occurred!');
            break;
        }
        return of(error);
      })
    );
  }
}
