import { UserService } from '../app/user/user.service';

export const UserServiceStub: Partial<UserService> = {
    signup$: jest.fn(),
    checkEmailExists$: jest.fn(),
};
