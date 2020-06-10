import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { mockHttpService } from '../../mocks/mock-http-service';
import { mockAppRepositoryService } from '../../mocks/mock-app-repository-service';
import { mockIUser, mockUser } from '../../mocks/mock-users';
import { of, throwError } from 'rxjs';
import { User } from '../user/user';
import { take, tap, switchMapTo } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

const error = { error: { message: 'Internal Server Error' }, status: 500 };
const httpError =  new HttpErrorResponse(error);

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService(
      mockHttpService as any,
      mockAppRepositoryService as any,
    );
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should initialize user subject as null', (done) => {
    service.userSubject.subscribe((user: User) => {
      expect(user).toBeNull();
      done();
    });
  });

  describe('login$', () => {

    describe('successful login', () => {

      beforeEach(() => {
        mockHttpService.post.mockReturnValueOnce(
          of({
            auth_token: 'valid-jwt',
            updatedUser: mockIUser
          })
        );
      });

      it('should return user', (done) => {
        service.login$(mockIUser.email.address, 'password')
          .subscribe((result) => {
            expect(result).toBeInstanceOf(User);
            expect(result.id).toEqual(mockIUser._id);
            expect(result.name).toEqual(mockIUser.name);
            expect(result.email).toEqual(mockIUser.email.address);
            done();
          });
      });

      it('should update user subject with new user', (done) => {
        service.login$(mockIUser.email.address, 'password')
          .pipe(
            take(1),
            switchMapTo(service.userSubject),
          ).subscribe((user: User) => {
            expect(user.id).toEqual(mockUser.id);
            expect(user.name).toEqual(mockUser.name);
            expect(user.email).toEqual(mockUser.email);
            done();
          });
      });

      it('should call app repository saveUser() method', (done) => {
        mockAppRepositoryService.saveUser.mockClear();
        expect(mockAppRepositoryService.saveUser).not.toHaveBeenCalled();

        service.login$(mockIUser.email.address, 'password')
          .subscribe((user: User) => {
            expect(mockAppRepositoryService.saveUser).toHaveBeenCalledWith(user);
            done();
          });
      });
    });

    describe('unsuccessful login', () => {
      it('should handle error returned by http response', (done) => {
        mockHttpService.post.mockReturnValueOnce(throwError(httpError));

        service.login$(mockIUser.email.address, 'password')
          .subscribe({
            error: (err) => {
              expect(err).toEqual(`API Error: ${httpError.error.message}, Status Code: ${httpError.status}`);
              done();
            }
          });
      });
    });
  });

  describe('logout$', () => {
    it('should set user subject to null and return true on success', (done) => {
      mockHttpService.post.mockReturnValueOnce(of(true));

      service.logout$().pipe(
        take(1),
        switchMapTo(service.userSubject)
      ).subscribe((result) => {
        expect(result).toBeNull();
        done();
      });
    });

    it('should handle error returned by http response', (done) => {
      mockHttpService.post.mockReturnValueOnce(throwError(httpError));

      service.logout$().subscribe({
        error: (err) => {
          expect(err).toEqual(`API Error: ${httpError.error.message}, Status Code: ${httpError.status}`);
          done();
        }
      });
    });
  });

  describe('autoLogin', () => {
    it('should get user data returned by app repository and push to user subject', (done) => {
      mockAppRepositoryService.getUser$.mockReturnValueOnce(of(mockUser));

      service.autoLogin();
      service.userSubject.subscribe((user: User) => {
        expect(user).not.toBeNull();
        expect(user).toEqual(mockUser);
        done();
      });
    });

    it('should do nothing when no user is returned by app repository', (done) => {
      service.userSubject.next(null);
      mockAppRepositoryService.getUser$.mockReturnValueOnce(of(null));

      service.autoLogin();
      service.userSubject.subscribe((result) => {
        expect(result).toBeNull();
        done();
      });
    });
  });

  describe('initUserSubject', () => {
    it('should initialize user subject with null value', (done) => {
      (service as any).initUserSubject();

      service.userSubject.subscribe((result) => {
        expect(result).toBeNull();
        done();
      });
    });
  });
});
