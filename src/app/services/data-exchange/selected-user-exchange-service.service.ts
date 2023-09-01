import { Injectable } from '@angular/core';
import { List_User } from 'src/app/contracts/user/list_user';

@Injectable({
  providedIn: 'root',
})
export class SelectedUserExchangeService {
  constructor() {}

  selectedUser: List_User = {
    email: '',
    id: '',
    twoFactorEnabled: false,
    userName: '',
  };

  setUser(user: List_User) {
    this.selectedUser = user;
  }
  getUser() {
    return this.selectedUser;
  }
}
