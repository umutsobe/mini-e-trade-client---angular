import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private jwtHelper: JwtHelperService, @Inject(PLATFORM_ID) private platformId: Object) {}
  isExpired = false;

  get Token(): string {
    if (typeof localStorage !== 'undefined') if (localStorage.getItem('accessToken')) return localStorage.getItem('accessToken');
    return '';
  }

  get DecodedToken() {
    if (this.jwtHelper.decodeToken(this.Token)) return this.jwtHelper.decodeToken(this.Token);
    return '';
  }

  get Role(): string {
    if (this.DecodedToken.roleName) return this.DecodedToken.roleName;
    return '';
  }
  get UserId(): string {
    if (this.DecodedToken.userId) return this.DecodedToken.userId;
    return '';
  }

  async identityCheck() {
    let token;
    if (typeof localStorage !== 'undefined') token = localStorage.getItem('accessToken'); //token aldık

    let isExpired: boolean;

    try {
      isExpired = await this.jwtHelper.isTokenExpired(token); //süresi geçmiş mi onu öğrendik
    } catch {
      isExpired = true;
    }

    this.isExpired = isExpired;

    if (token != null && !isExpired) _isAuthenticated = true; // token varsa ve expired değilse true olacak
    else _isAuthenticated = false;
  }

  get isAuthenticated() {
    //normal user görevi görecek. zaten giriş yapan herkes normal kullanıcı yetkisine sahip
    return _isAuthenticated;
  }

  isAdmin(): boolean {
    return this.Role == 'admin' && this.Token != null && !this.isExpired;
  }

  isModerator(): boolean {
    return this.Role == 'moderator' && this.Token != null && !this.isExpired;
  }
}

export let _isAuthenticated = true;
