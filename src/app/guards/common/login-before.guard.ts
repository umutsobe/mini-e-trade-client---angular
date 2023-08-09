import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { _isAuthenticated } from 'src/app/services/common/auth/auth.service';

@Injectable({
  providedIn: 'root',
})

//login olmamışken ulaşılamayacak yerlere koy
export class LoginBeforeGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (_isAuthenticated) {
      return true;
    }

    return false;
  }
}
