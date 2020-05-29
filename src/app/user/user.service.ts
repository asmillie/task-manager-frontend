import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User, IUser } from './user';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.taskApi.url;
  private USER_SIGNUP = environment.taskApi.endpoint.signup;
  private EMAIL_EXISTS = environment.taskApi.endpoint.emailExists;

  constructor(private http: HttpClient) {}

  signup$(name: string, email: string, password: string): Observable<User> {
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

  checkEmailExists$(email: string): Observable<boolean> {
    return this.http.post<{ emailExists: boolean }>(
      this.API_URL + this.EMAIL_EXISTS,
      {
        email,
      }
    ).pipe(
      map(({emailExists}) => {
        return emailExists;
      }),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // TODO: Handle client / network error
      console.error(`An error occurred: ${error.error.message}`);
    } else {
      // TODO: backend returned error
    }

    return throwError(`An error occurred`);
  }
}
