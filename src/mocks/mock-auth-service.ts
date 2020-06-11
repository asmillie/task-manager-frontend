import { BehaviorSubject } from 'rxjs';
import { User } from '../app/user/user';
import { mockUser } from './mock-users';

export const mockAuthService = {
    userSubject: new BehaviorSubject<User>(mockUser),
};
