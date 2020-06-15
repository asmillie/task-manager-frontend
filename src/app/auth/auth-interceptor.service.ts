import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        private authService: AuthService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.userSubject.pipe(
            take(1),
            exhaustMap(user => {
                if (!user || !user.token) {
                    return next.handle(req);
                }

                const modReq = req.clone({
                    setHeaders: { Authorization: `Bearer ${user.token}` },
                });
                return next.handle(modReq);
            })
        );
    }
}
