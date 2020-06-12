import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { User, IUser } from './class/user';
import { mockHttpService } from '../../mocks/mock-http-service';
import { mockIUser, mockUser } from '../../mocks/mock-users';
import { mockAuthService } from '../../mocks/mock-auth-service';
import { take } from 'rxjs/operators';
import { UserUpdateOpts } from './class/user-update-opts';

const httpError = new HttpErrorResponse({ error: 'Internal Server Error', status: 500 });

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(
      mockHttpService as any,
      mockAuthService as any);
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
      mockHttpService.post.mockReturnValueOnce(throwError(httpError));

      service.checkEmailExists$('email').subscribe({
        error: (err) => {
          expect(err).toEqual(`API Error: ${httpError.error}, Status Code: ${httpError.status}`);
          done();
        }
      });
    });
  });

  describe('update$', () => {
    it('should update userSubject in authService with updated user', (done) => {
      mockAuthService.userSubject = new BehaviorSubject<User>(mockUser);
      const newEmail = 'newemail@addr.com';
      mockHttpService.patch.mockReturnValueOnce(
        of({
          _id: mockUser.id,
          name: mockUser.name,
          email: {
            address: newEmail,
          },
        })
      );

      const userUpdateOpts: UserUpdateOpts = {
        email: {
          address: newEmail,
        }
      };

      service.update$(userUpdateOpts, mockUser.token).pipe(take(1)).subscribe(_ => {
        mockAuthService.userSubject.pipe(
          take(1)
        ).subscribe((user: User) => {
          expect(user.name).toEqual(mockUser.name);
          expect(user.email).toEqual(newEmail);
          expect(user.token).toEqual(mockUser.token);
        });
        done();
      });
    });

    it('should return updated user', (done) => {
      const name = 'Jane';
      const address = 'jane@newaddr.com';
      const mockUpdatedIUser: IUser = {
        name,
        email: { address },
        _id: mockUser.id
      };
      mockHttpService.patch.mockReturnValueOnce(of(mockUpdatedIUser));

      const userUpdateOpts: UserUpdateOpts = {
        name,
        email: { address }
      };

      service.update$(userUpdateOpts, 'token').subscribe((user: User) => {
        expect(user.name).toEqual(name);
        expect(user.email).toEqual(address);
        done();
      });
    });

    it('should handle error returned by http response', (done) => {
      mockHttpService.patch.mockReturnValueOnce(throwError(httpError));

      service.update$({ name: 'Jane' }, 'token').subscribe({
        error: (err) => {
          expect(err).toEqual(`API Error: ${httpError.error}, Status Code: ${httpError.status}`);
          done();
        }
      });
    });
  });
});
