import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }

  handleHttpError$(response: HttpErrorResponse): Observable<never> {
    let err = '';
    if (response.error instanceof ErrorEvent) {
      err = `An error occurred: ${response.error.message}`;
    } else {
      err = `API Error: ${response.error.message}, Status Code: ${response.status}`;
    }

    return throwError(err);
  }
}
