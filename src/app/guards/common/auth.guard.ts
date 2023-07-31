import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _isAuthenticated } from 'src/app/services/common/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private spinner: NgxSpinnerService, private toastr: ToastrService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.spinner.show();

    if (!_isAuthenticated) {
      // token yoksa veya token süresi geçmişse tekrar oturum açmasını sağlayabilmek için login sayfasına yönlendiriyoruz
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });

      this.toastr.error('Oturum açmanız gerekiyor', 'Yetkisiz Erişim');
    }

    this.spinner.hide();
    return true;
  }
}
