import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { UserService } from './user.service';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, switchMapTo, take, tap, debounceTime, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class EmailExistsValidator {
    constructor(private userService: UserService) {}

    validate(): AsyncValidatorFn {
        return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
            return ctrl.valueChanges.pipe(
                debounceTime(500),
                take(1),
                switchMap(_ => this.userService.checkEmailExists$(ctrl.value).pipe(
                    map(emailExists => emailExists ? { emailExists: true } : null),
                    catchError((e: any) => {
                        return of(null);
                    }),
                )),
            );
        };
    }
}
