import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private jwtHelper: JwtHelperService) {}

  identityCheck() {
    const token = localStorage.getItem('accessToken'); //token aldık

    let isExpired: boolean;

    try {
      isExpired = this.jwtHelper.isTokenExpired(token); //süresi geçmiş mi onu öğrendik
    } catch {
      isExpired = true;
    }
    if (token != null && !isExpired) _isAuthenticated = true; // token varsa ve expired değilse true olacak
  }

  get isAuthenticated() {
    return _isAuthenticated;
  }
}

export let _isAuthenticated: boolean;
