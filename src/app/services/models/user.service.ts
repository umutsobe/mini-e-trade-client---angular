import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { User } from 'src/app/entities/user';
import { Create_User } from 'src/app/contracts/create_user';
import { Observable, firstValueFrom } from 'rxjs';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SocialUser } from '@abacritt/angularx-social-login';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClientService, private toastr: ToastrService, private spinner: NgxSpinnerService, private jwtHelper: JwtHelperService) {}

  async create(user: User): Promise<Create_User> {
    const observable: Observable<Create_User | User> = this.http.post<Create_User | User>(
      {
        controller: 'users',
      },
      user
    );

    return (await firstValueFrom(observable)) as Create_User;
  }

  async login(emailOrUserName: string, password: string, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.http.post<any | TokenResponse>(
      {
        controller: 'users',
        action: 'login',
      },
      { emailOrUserName, password }
    );

    const tokenResponse: TokenResponse = (await firstValueFrom(observable)) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);
      this.toastr.success('Giriş Başarılı', 'Login');
      this.spinner.hide();
    }
  }

  async googleLogin(user: SocialUser, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> = this.http.post<SocialUser | TokenResponse>(
      {
        controller: 'users',
        action: 'googlelogin',
      },
      user
    );

    const tokenResponse: TokenResponse = (await firstValueFrom(observable)) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);

      this.toastr.success('Google Üzerinden Giriş Başarılı', 'Giriş Başarılı');
    }

    callBackFunction();
  }

  getUserId(): string {
    const token = localStorage.getItem('accessToken');
    const decodedToken = this.jwtHelper.decodeToken(token);

    const userId: string = decodedToken.userId;
    return userId;
  }

  async passwordReset(email: string, callBackFunction?: () => void) {
    const observable = this.http.post(
      {
        controller: 'Users',
        action: 'password-reset',
      },
      { email: email }
    );

    await firstValueFrom(observable);
    callBackFunction();
  }
  async verifyResetToken(resetToken: string, userId: string, callBackFunction?: () => void): Promise<boolean> {
    const observable: Observable<any> = this.http.post(
      {
        controller: 'users',
        action: 'verify-reset-token',
      },
      {
        resetToken: resetToken,
        userId: userId,
      }
    );

    const state: boolean = await firstValueFrom(observable);
    callBackFunction();
    return state;
  }

  async updatePassword(userId: string, resetToken: string, password: string, passwordRepeat: string) {
    const observable: Observable<any> = this.http.post(
      {
        controller: 'users',
        action: 'update-password',
      },
      { userId: userId, resetToken: resetToken, password: password, passwordRepeat: passwordRepeat }
    );

    await firstValueFrom(observable);
  }
}
