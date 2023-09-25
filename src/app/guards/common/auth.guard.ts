import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, _isAuthenticated } from 'src/app/services/common/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnInit {
  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}
  async ngOnInit() {
    await this.authService.identityCheck();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // var canContinue: boolean = false;

    // if (isPlatformBrowser(this.platformId)) {
    //   // Browser
    //   // Verify here if the token exists
    //   canContinue = _isAuthenticated;

    //   if (!canContinue) {
    //     this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });

    //     this.toastr.error('Oturum açmanız gerekiyor', 'Yetkisiz Erişim');
    //   }
    // }
    // if (isPlatformServer(this.platformId)) {
    //   // Server side
    //   canContinue = true;
    // }

    // return canContinue;

    return true;
  }
}
