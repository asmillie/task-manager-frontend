import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { User, IUser } from '../user/user';
import { environment } from '../../environments/environment';
import { map, catchError, tap, take } from 'rxjs/operators';

interface ILoginResponse {
  readonly auth_token: string;
  readonly updatedUser: IUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = environment.taskApi.url;
  private LOGIN = environment.taskApi.endpoint.login;
  private LOGOUT = environment.taskApi.endpoint.logout;

  userSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.initUserSubject();
  }

  login$(email: string, password: string): Observable<User> {
    return this.http.post<ILoginResponse>(
      this.API_URL + this.LOGIN,
      {
        email,
        password,
      }
    ).pipe(
      catchError(this.handleError),
      map((res: ILoginResponse) => {
        return new User(res.updatedUser.name, res.updatedUser.email.address, res.updatedUser._id, res.auth_token);
      }),
      tap((user: User) => {
        this.userSubject.next(user);
      }),
    );
  }

  logout$(): Observable<boolean> {
    return this.http.post<IUser>(
      this.API_URL + this.LOGOUT,
      {}
    ).pipe(
      take(1),
      catchError(this.handleError),
      map(_ => {
        this.userSubject.next(null);
        return true;
      }),
    );
  }

  private initUserSubject(): void {
    this.userSubject = new BehaviorSubject<User>(null);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let err = '';
    if (error.error instanceof ErrorEvent) {
      // TODO: Handle client / network error
      err = `An error occurred: ${error.error.message}`;
    } else {
      // TODO: backend returned error
      err = `API Error: ${error.error.message}, Status Code: ${error.status}`;
    }

    return throwError(err);
  }
}
