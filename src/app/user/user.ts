import { Url } from 'url';

export interface IUser {
    _id?: string;
    name: string;
    email: {
        address: string;
    };
    avatarUrl?: Url;
    token?: string;
}

export class User {
    private _id: string;
    private _name: string;
    private _email: string;
    private _avatarUrl: Url;
    private _token: string;

    constructor(
        name: string,
        email: string,
        id?: string,
        token?: string,
        avatarUrl?: Url) {
            this._name = name;
            this._email = email;
            if (id) {
                this._id = id;
            }
            if (token) {
                this._token = token;
            }
            if (avatarUrl) {
                this._avatarUrl = avatarUrl;
            }
        }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get email(): string {
        return this._email;
    }

    set email(email: string) {
        this._email = email;
    }

    get token(): string {
        return this._token;
    }

    set token(token: string) {
        this._token = token;
    }

    get avatarUrl(): Url {
        return this._avatarUrl;
    }

    set avatarUrl(url: Url) {
        this._avatarUrl = url;
    }

}
