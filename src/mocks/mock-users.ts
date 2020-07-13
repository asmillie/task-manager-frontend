import { IUser, User } from '../app/user/class/user';

const exp = new Date();
exp.setDate(exp.getDate() + 2);

export const mockIUser: IUser = {
    name: 'Bob',
    email: { address: 'bob@builder.com' },
    _id: 'user-id',
    tokenExpiry: exp,
};

export const mockUser = new User(
    mockIUser.name,
    mockIUser.email.address,
    mockIUser._id,
    'valid-jwt',
    exp,
);
