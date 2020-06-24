import { TestBed } from '@angular/core/testing';

import { ErrorHandlingService } from './error-handling.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from 'class-validator';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleHttpError$', () => {
    it('should return formatted error message', (done) => {
      const error = new HttpErrorResponse({
        status: 500,
        error: { message: 'Internal Server Exception' }
      });

      service.handleHttpError$(error).subscribe({
        error: (result) => {
          expect(result).toEqual(`API Error: ${error.error.message}, Status Code: ${error.status}`);
          done();
        }
      });
    });
  });

  describe('handleValidationError$', () => {
    it('should return formatted error message', (done) => {
      const vErrorOne = new ValidationError();
      vErrorOne.property = 'completed';
      vErrorOne.constraints = { required: 'Field is required' };
      const vErrorTwo = new ValidationError();
      vErrorTwo.property = 'skip';
      vErrorTwo.constraints = { int: 'Must be an integer' };
      const vErrors: ValidationError[] = [vErrorOne, vErrorTwo];

      service.handleValidationError$(vErrors).subscribe({
        error: (result) => {
          expect(result).toContain(vErrorOne.constraints.required);
          expect(result).toContain(vErrorTwo.constraints.int);
          done();
        }
      });
    });
  });
});
