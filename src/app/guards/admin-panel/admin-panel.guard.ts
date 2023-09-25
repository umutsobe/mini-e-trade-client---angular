import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'src/app/services/common/auth/auth.service';

@Injectable({
  providedIn: 'root',
})

//login olduktan sonra ulaşılamayacak yerlere koy. mesela login, register sayfaları
export class AdminPanelGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // if (this.authService.isAdmin() || this.authService.isModerator()) return true;

    // this.router.navigateByUrl('/error');
    // return false;

    //sadece developmentta return true, diğerlerinde yukarıdaki
    return true;
  }
}
