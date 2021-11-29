import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Url } from 'url';

@Injectable({
  providedIn: 'root'
})
export class AppRepositoryService {

  private USER_KEY = 'user';

  constructor() { }

  saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser$(): Observable<User> {
    const userData: {
      _id: string,
      _name: string,
      _email: string,
      _token: string,
      _tokenExpiry: string,
      _avatarUrl?: Url,
    } = JSON.parse(localStorage.getItem(this.USER_KEY));

    if (!userData) {
      return of(null);
    }

    return of(
      new User(
        userData._name,
        userData._email,
        userData._id,
        userData._token,
        new Date(userData._tokenExpiry),
        userData._avatarUrl)
    );
  }

  deleteUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }
}
