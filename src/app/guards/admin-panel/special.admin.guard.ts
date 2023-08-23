import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'src/app/services/common/auth/auth.service';

@Injectable({
  providedIn: 'root',
})

//login olduktan sonra ulaşılamayacak yerlere koy. mesela login, register sayfaları
export class SpecialAdminGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.authService.isAdmin();
  }
}
