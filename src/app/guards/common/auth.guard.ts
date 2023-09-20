import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _isAuthenticated } from 'src/app/services/common/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private spinner: NgxSpinnerService, private toastr: ToastrService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.spinner.show();

    if (!_isAuthenticated) {
      // token yoksa veya token süresi geçmişse tekrar oturum açmasını sağlayabilmek için login sayfasına yönlendiriyoruz
      if (isPlatformBrowser(this.platformId)) {
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });

        this.toastr.error('Oturum açmanız gerekiyor', 'Yetkisiz Erişim');
        //serverda auth durumu false olduğu için bu toastr serverdan render edilip geliyor ve dokunduğumuzda gitmiyordu
      }
    }

    this.spinner.hide();
    return true;
  }
}
