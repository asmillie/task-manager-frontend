import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { User } from './user';
import { mockHttpService } from '../../mocks/mock-http-service';
import { mockIUser } from '../../mocks/mock-users';

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
      mockHttpService.post.mockReturnValueOnce(of(mockIUser));

      service.signup$(mockIUser.name, mockIUser.email.address, 'strongpass').subscribe(
        (result: User) => {
          expect(result).toBeInstanceOf(User);
          expect(result.name).toEqual(mockIUser.name);
          expect(result.email).toEqual(mockIUser.email.address);
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
