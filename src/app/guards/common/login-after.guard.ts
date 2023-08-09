import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { _isAuthenticated } from 'src/app/services/common/auth/auth.service';

@Injectable({
  providedIn: 'root',
})

//login olduktan sonra ulaşılamayacak yerlere koy. mesela login, register sayfaları
export class LoginAfterGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (_isAuthenticated) {
      return false;
    }

    return true;
  }
}
