import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { User } from 'src/app/entities/user';
import { Create_User } from 'src/app/contracts/create_user';
import { Observable, firstValueFrom } from 'rxjs';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClientService, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

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
}
