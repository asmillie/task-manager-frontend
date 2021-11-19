import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { User, IUser } from '../user/class/user';
import { environment } from '../../environments/environment';
import { map, catchError, tap, take, flatMap } from 'rxjs/operators';
import { AppRepositoryService } from '../data/app-repository.service';
import { ErrorHandlingService } from '../error-handling.service';

interface ILoginResponse {
  readonly auth_token: string;
  readonly token_expiry: string;
  readonly updatedUser: IUser;
}

interface IRecaptchaResponse {
  readonly success: boolean;
  readonly challege_ts: string;
  readonly hostname: string;
  readonly errorCodes?: [{ code: string, description: string }];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = environment.taskApi.url;
  private readonly LOGIN = environment.taskApi.endpoint.login;
  private readonly LOGOUT = environment.taskApi.endpoint.logout;
  private readonly VERIFY_RECAPTCHA = environment.taskApi.endpoint.verifyRecaptcha;

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
        if (!res.auth_token || !res.token_expiry) {
          throw new Error('Invalid token returned by server, please try again');
        }
        const tokenExpiry = new Date(res.token_expiry);
        return new User(res.updatedUser.name, res.updatedUser.email.address, res.updatedUser._id, res.auth_token, tokenExpiry);
      }),
      tap((user: User) => {
        this.userSubject.next(user);
        this.appRepository.saveUser(user);
      }),
    );
  }

  /**
   * If user authentication token
   * is valid (not expired) then an
   * attempt to log out in the api is made.
   * Regardless of the api call the local
   * user data is cleared.
   */
  logout$(): Observable<boolean> {
    return this.userSubject.pipe(
      take(1),
      flatMap((user: User) => {
        if (!user) {
          return of(true);
        }

        const now = new Date();
        if (user.tokenExpiry.getTime() >= now.getTime()) {
          return this.http.post<IUser>(
            this.API_URL + this.LOGOUT,
            {}
          ).pipe(
            take(1),
            catchError(this.errorHandling.handleHttpError$),
            map(_ => true),
          );
        }
        return of(true);
      }),
      tap(_ => {
        this.appRepository.deleteUser();
        this.userSubject.next(null);
      }),
    );
  }

  autoLogin(): void {
    this.appRepository.getUser$().pipe(
      take(1),
    ).subscribe((user: User) => {
      if (!user || !user.token || !user.tokenExpiry) {
        return;
      }

      const now = new Date();
      if (user.tokenExpiry.getTime() <= now.getTime()) {
        this.logout$().subscribe();
      } else {
        this.userSubject.next(user);
      }
    });
  }

  verifyRecaptcha$(token: string): Observable<boolean> {
    return this.http.post<IRecaptchaResponse>(
      this.API_URL + this.VERIFY_RECAPTCHA,
      { token },
    )
    .pipe(
      take(1),
      map(res => {
        console.log(res);
        return true;
      }),
    );
  }

  private initUserSubject(): void {
    this.userSubject = new BehaviorSubject<User>(null);
  }
}
