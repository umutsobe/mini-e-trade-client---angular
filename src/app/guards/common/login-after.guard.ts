import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { _isAuthenticated } from 'src/app/services/common/auth/auth.service';

@Injectable({
  providedIn: 'root',
})

//login olduktan sonra ulaşılamayacak yerlere koy. mesela login, register sayfaları
export class LoginAfterGuard implements CanActivate {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | null {
    var canContinue: boolean = false;

    if (isPlatformBrowser(this.platformId)) {
      if (_isAuthenticated) canContinue = _isAuthenticated;
      else canContinue = true;
    }
    if (isPlatformServer(this.platformId)) {
      // Server side
      if (_isAuthenticated) canContinue = _isAuthenticated;
      else canContinue = true;
    }

    return canContinue;
  }
}
