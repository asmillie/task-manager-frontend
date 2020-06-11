import { BehaviorSubject } from 'rxjs';
import { User } from '../app/user/class/user';
import { mockUser } from './mock-users';

export const mockAuthService = {
    userSubject: new BehaviorSubject<User>(mockUser),
};
