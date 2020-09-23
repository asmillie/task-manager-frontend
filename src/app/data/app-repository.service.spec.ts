import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { User } from '../user/class/user';

import { AppRepositoryService } from './app-repository.service';

describe('AppRepositoryService', () => {
  let service: AppRepositoryService;
  const user = new User('Bob', 'bob@example.com');
  const userJson = JSON.stringify(user);
  const USER_KEY = 'user';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveUser', () => {
    it('should call localStorage.setItem() to save user', () => {
      const spy = jest.spyOn(Storage.prototype, 'setItem');

      service.saveUser(user);
      expect(spy).toHaveBeenCalledWith(USER_KEY, userJson);
    });
  });

  describe('getUser$', () => {
    it('should call localStorage.getItem to get user', (done) => {
      const spy = jest.spyOn(Storage.prototype, 'getItem');

      service.getUser$().subscribe(() => {
        expect(spy).toHaveBeenCalledWith(USER_KEY);
        done();
      });
    });

    it('should return user', (done) => {
      Storage.prototype.getItem = jest.fn()
      .mockImplementationOnce(() => userJson);

      service.getUser$().subscribe(data => {
        expect(data.name).toEqual(user.name);
        expect(data.email).toEqual(user.email);
        done();
      });
    });

    it('should return null', (done) => {
      Storage.prototype.getItem = jest.fn().mockImplementationOnce(() => null);

      service.getUser$().subscribe(data => {
        expect(data).toBeNull();
        done();
      });
    });
  });

  describe('deleteUser', () => {
    it('should call localStorage.remoteItem to delete user', () => {
      const spy = jest.spyOn(Storage.prototype, 'removeItem');

      service.deleteUser();
      expect(spy).toHaveBeenCalledWith(USER_KEY);
    });
  });
});
