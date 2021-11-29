import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { take } from 'rxjs/operators';
import { User } from '@auth0/auth0-spa-js';

@Injectable()
export class UserInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let user: User;
    this.authService.user$.pipe(take(1)).subscribe(userData => user = userData);
    if (!user) {
      return next.handle(request);
    }

    const modReq = request.clone({
      body: {
        ...request.body,
        user: {
          email: user.email 
        }
      }
    })
    return next.handle(modReq);
  }
}
