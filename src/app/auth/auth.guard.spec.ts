import { AuthGuard } from './auth.guard';
import { mockAuthService } from '../../mocks/mock-auth-service';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment } from '@angular/router';

jest.mock('@angular/router');

const mockActivatedRouteSnapshot: any = {
  url: [new UrlSegment('path', {})],
};

const mockRouterStateSnapshot: any = {};

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: mockAuthService },
        Router,
      ]
    });
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true', (done) => {
      guard
        .canActivate(
          mockActivatedRouteSnapshot,
          mockRouterStateSnapshot)
        .subscribe(result => {
          expect(result).toEqual(true);
          done();
        });
    });

    it('should return redirect to home', (done) => {
      mockAuthService.userSubject.next(null);

      guard
        .canActivate(
          mockActivatedRouteSnapshot,
          mockRouterStateSnapshot)
        .subscribe(result => {
          expect(result).toEqual(router.createUrlTree(['/']));
          done();
        });
    });
  });
});
