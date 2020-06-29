import { TestBed } from '@angular/core/testing';

import { ErrorHandlingService } from './error-handling.service';
import { HttpErrorResponse } from '@angular/common/http';

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
});
