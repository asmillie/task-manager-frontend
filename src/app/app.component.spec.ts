import { TestBed, waitForAsync } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { AppComponent } from './app.component';
import { MockAuthService } from '../mocks/mock-auth-service';

describe('AppComponent', () => {
  let component: AppComponent;
  let authService: AuthService;
  const mockAuthService = new MockAuthService();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        AppComponent,
        { provide: AuthService, useValue: mockAuthService as any }
      ]
    });

    component = TestBed.inject(AppComponent);
    authService = TestBed.inject(AuthService);
  }));

  it('should set title', () => {
    expect(component.title).toEqual('Task Manager');
  })

  describe('ngOnInit', () => {
    it('should call method to intialize error observable', () => {
      const compSpy = jest.spyOn(component as any, 'initErrorObs');
      expect(compSpy).not.toHaveBeenCalled();

      component.ngOnInit();
      expect(compSpy).toHaveBeenCalled();
    });
  });
});
