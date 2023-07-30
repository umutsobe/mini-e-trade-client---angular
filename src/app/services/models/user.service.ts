import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { User } from 'src/app/entities/user';
import { Create_User } from 'src/app/contracts/create_user';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClientService) {}

  async create(user: User): Promise<Create_User> {
    const observable: Observable<Create_User | User> = this.http.post<Create_User | User>(
      {
        controller: 'users',
      },
      user
    );

    return (await firstValueFrom(observable)) as Create_User;
  }
}
