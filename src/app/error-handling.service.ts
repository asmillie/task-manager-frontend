import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ValidationError } from 'class-validator';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }

  handleHttpError$(error: HttpErrorResponse): Observable<never> {
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

  handleValidationError$(validationErrors: ValidationError[]): Observable<never> {
    let err = '';
    validationErrors.forEach(({constraints}) => err += `${constraints}\n`);
    return throwError(err);
  }
}
