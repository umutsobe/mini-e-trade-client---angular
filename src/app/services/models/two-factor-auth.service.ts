import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpClientService } from '../common/http-client.service';
import { TwoFactorResult } from 'src/app/contracts/two-factor-auth/TwoFactorResult';
import { IsCodeValidRequest } from 'src/app/contracts/two-factor-auth/IsCodeValidRequest';

@Injectable({
  providedIn: 'root',
})
export class TwoFactorAuthService {
  constructor(private http: HttpClientService) {}

  async createCodeAndSendEmail(userId: string): Promise<TwoFactorResult> {
    const observable: Observable<TwoFactorResult> = this.http.get(
      {
        controller: 'TwoFactorAuthentication',
        action: 'CreateCodeAndSendEmail',
      },
      userId
    );

    return await firstValueFrom(observable);
  }
  async isCodeValid(model: IsCodeValidRequest): Promise<TwoFactorResult> {
    const observable: Observable<TwoFactorResult | any> = this.http.post(
      {
        controller: 'TwoFactorAuthentication',
        action: 'IsCodeValid',
      },
      model
    );

    return (await firstValueFrom(observable)) as TwoFactorResult;
  }
}
