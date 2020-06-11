import { IUser, User } from '../app/user/class/user';

export const mockIUser: IUser = {
    name: 'Bob',
    email: { address: 'bob@builder.com' },
    _id: 'user-id',
};

export const mockUser = new User(
    mockIUser.name,
    mockIUser.email.address,
    mockIUser._id,
    'valid-jwt'
);
