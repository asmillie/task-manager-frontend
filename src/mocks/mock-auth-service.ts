import { User } from '@auth0/auth0-spa-js';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { mockUser } from './mock-user';

export class MockAuthService {
    _error$ = new ReplaySubject<Error>(1);
    _user$ = new BehaviorSubject<User>(mockUser);

    readonly error$ = this._error$.asObservable();
    readonly user$ = this._user$.asObservable();
    logout = jest.fn();

    getAccessTokenSilently = jest.fn();
};
