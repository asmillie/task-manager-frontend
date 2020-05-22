import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User, IUser } from './user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.taskApi.url;
  private USER_SIGNUP = environment.taskApi.endpoint.user.signup;

  constructor(private http: HttpClient) { }

  signup(name: string, email: string, password: string): Observable<User> {
    return this.http.post<IUser>(
      this.API_URL + this.USER_SIGNUP,
      {
        name,
        email: {
          address: email,
        },
        password,
      }
    ).pipe(
      map((user) => {
        if (user) {
          return new User(user.name, user.email.address, user._id);
        }

        return null;
      })
    );
  }
}
