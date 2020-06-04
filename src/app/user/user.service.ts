import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User, IUser } from './user';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.taskApi.url;
  private USER_SIGNUP = environment.taskApi.endpoint.signup;
  private EMAIL_EXISTS = environment.taskApi.endpoint.emailExists;

  constructor(private http: HttpClient) {}

  signup$(name: string, email: string, password: string): Observable<User | string> {
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
      catchError(this.handleError),
      map((user) => {
        if (user) {
          return new User(user.name, user.email.address, user._id);
        }

        return null;
      })
    );
  }

  checkEmailExists$(email: string): Observable<boolean | string> {
    return this.http.post<{ emailExists: boolean }>(
      this.API_URL + this.EMAIL_EXISTS,
      {
        email,
      }
    ).pipe(
      catchError(this.handleError),
      map(({emailExists}) => {
        return emailExists;
      }),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let err = '';
    if (error.error instanceof ErrorEvent) {
      // TODO: Handle client / network error
      err = `An error occurred: ${error.error.message}`;
    } else {
      // TODO: backend returned error
      err = `API Error: ${error.error}, Status Code: ${error.status}`;
    }

    return throwError(err);
  }
}
