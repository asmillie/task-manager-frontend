import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { IUser, User } from './user';
import { mockHttpService } from '../../mocks/mock-http-service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(mockHttpService as any);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('signup$', () => {
    it('should return a User', (done) => {
      const mockUser: IUser = {
        name: 'Bob',
        email: { address: 'bob@builder.com' },
        _id: 'user-id',
      };

      mockHttpService.post.mockReturnValueOnce(of(mockUser));

      service.signup$(mockUser.name, mockUser.email.address, 'strongpass').subscribe(
        (result: User) => {
          expect(result).toBeInstanceOf(User);
          expect(result.name).toEqual(mockUser.name);
          expect(result.email).toEqual(mockUser.email.address);
          done();
        }
      );
    });

    it('should handle error returned by http response', (done) => {
      const httpError =  new HttpErrorResponse({ error: 'Internal Server Error', status: 500 });
      mockHttpService.post.mockReturnValueOnce(throwError(httpError));

      service.signup$('name', 'email', 'password').subscribe({
        error: (err) => {
          expect(err).toEqual(`API Error: ${httpError.error}, Status Code: ${httpError.status}`);
          done();
        }
      });
    });
  });

  describe('checkEmailExists$', () => {
    it('should return true', (done) => {
      mockHttpService.post.mockReturnValueOnce(of({ emailExists: true }));

      service.checkEmailExists$('validemail').subscribe((result) => {
        expect(result).toEqual(true);
        done();
      });
    });

    it('should return false', (done) => {
      mockHttpService.post.mockReturnValueOnce(of({ emailExists: false }));

      service.checkEmailExists$('validemail').subscribe((result) => {
        expect(result).toEqual(false);
        done();
      });
    });

    it('should handle error returned by http response', (done) => {
      const httpError =  new HttpErrorResponse({ error: 'Internal Server Error', status: 500 });
      mockHttpService.post.mockReturnValueOnce(throwError(httpError));

      service.checkEmailExists$('email').subscribe({
        error: (err) => {
          expect(err).toEqual(`API Error: ${httpError.error}, Status Code: ${httpError.status}`);
          done();
        }
      });
    });
  });
});
