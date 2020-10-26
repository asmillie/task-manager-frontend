import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User, IUser } from './class/user';
import { Observable, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError, tap, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { UserUpdateOpts } from './class/user-update-opts';
import { ErrorHandlingService } from '../error-handling.service';
import { ITask } from '../tasks/task';
import { AppRepositoryService } from '../data/app-repository.service';

export interface DemoResponse {
  auth_token: string;
  token_expiry: Date;
  user: IUser;
  tasks: ITask[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.taskApi.url;
  private USER_SIGNUP = environment.taskApi.endpoint.signup;
  private USER_UPDATE = environment.taskApi.endpoint.user.patch;
  private EMAIL_EXISTS = environment.taskApi.endpoint.emailExists;
  private DEMO_SIGNUP = environment.taskApi.endpoint.signupDemo;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private appRepository: AppRepositoryService,
    private errorHandling: ErrorHandlingService) {}

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
      catchError(this.errorHandling.handleHttpError$),
      map((user) => {
        if (user) {
          return new User(user.name, user.email.address, user._id);
        }

        return null;
      })
    );
  }

  signupDemo$(): Observable<boolean | string> {
    return this.http.get<DemoResponse>(
      this.API_URL + this.DEMO_SIGNUP
    ).pipe(
      catchError(this.errorHandling.handleHttpError$),
      map((res) => {
        if (!res.auth_token || !res.token_expiry) {
          throw new Error('Invalid token returned by server, please try again');
        }
        const tokenExpiry = new Date(res.token_expiry);
        const user = new User(res.user.name, res.user.email.address, res.user._id, res.auth_token, tokenExpiry);
        this.authService.userSubject.next(user);
        this.appRepository.saveUser(user);

        return true;
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
      catchError(this.errorHandling.handleHttpError$),
      map(({emailExists}) => {
        return emailExists;
      }),
    );
  }

  update$(userUpdateOpts: UserUpdateOpts, token: string): Observable<User | string> {
    return this.http.patch<IUser>(
      this.API_URL + this.USER_UPDATE,
      userUpdateOpts
    ).pipe(
      catchError(this.errorHandling.handleHttpError$),
      map((user: IUser) => {
        if (!user) {
          return null;
        }

        return new User(user.name, user.email.address, user._id, token);
      }),
      tap((user: User) => {
        this.authService.userSubject.next(user);
      }),
    );
  }
}
