import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { User, IUser } from '../user/class/user';
import { environment } from '../../environments/environment';
import { map, catchError, tap, take } from 'rxjs/operators';
import { AppRepositoryService } from '../data/app-repository.service';
import { ErrorHandlingService } from '../error-handling.service';

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

  constructor(
    private http: HttpClient,
    private appRepository: AppRepositoryService,
    private errorHandling: ErrorHandlingService) {
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
      catchError(this.errorHandling.handleHttpError$),
      map((res: ILoginResponse) => {
        return new User(res.updatedUser.name, res.updatedUser.email.address, res.updatedUser._id, res.auth_token);
      }),
      tap((user: User) => {
        this.userSubject.next(user);
        this.appRepository.saveUser(user);
      }),
    );
  }

  logout$(): Observable<boolean> {
    return this.http.post<IUser>(
      this.API_URL + this.LOGOUT,
      {}
    ).pipe(
      take(1),
      catchError(this.errorHandling.handleHttpError$),
      map(_ => {
        this.userSubject.next(null);
        this.appRepository.deleteUser();
        return true;
      }),
    );
  }

  autoLogin(): void {
    this.appRepository.getUser$().pipe(
      take(1),
    ).subscribe((user: User) => {
      if (!user || !user.token) {
        return;
      }
      // TODO: Token Expiry
      this.userSubject.next(user);
    });
  }

  private initUserSubject(): void {
    this.userSubject = new BehaviorSubject<User>(null);
  }
}
