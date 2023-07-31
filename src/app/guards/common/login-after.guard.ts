import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { _isAuthenticated } from 'src/app/services/common/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginAfterGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (_isAuthenticated) {
      return false;
    }

    return true;
  }
}
