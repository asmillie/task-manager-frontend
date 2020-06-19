import { UserService } from '../app/user/user.service';

export const mockUserService: any = {
    signup$: jest.fn(),
    checkEmailExists$: jest.fn(),
    update$: jest.fn(),
};
