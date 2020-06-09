import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from './user';
import { AuthService } from '../auth/auth.service';
import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UserResolverService implements Resolve<User> {

    constructor(
        private authService: AuthService,
        private router: Router) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<User> | Observable<never> {

        return this.authService.userSubject.pipe(
            take(1),
            mergeMap(user => {
                if (user) {
                    return of(user);
                } else {
                    this.router.navigate(['']);
                    return EMPTY;
                }
            }),
        );
    }
}
