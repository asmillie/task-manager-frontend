export interface ITask {
    readonly owner: string;
    readonly _id: string;
    readonly description: string;
    readonly completed: boolean;
    readonly createdAt: Date;
    readonly updatedAt?: Date;
}

export class Task {
    readonly _owner: string;
    readonly _id: string;
    private _description: string;
    private _completed: boolean;
    readonly _createdAt: Date;
    readonly _updatedAt?: Date;

    constructor(owner: string, description: string, completed: boolean, createdAt?: Date, updatedAt?: Date, id?: string) {
        this._owner = owner;
        this._description = description;
        this._completed = completed;
        this._createdAt = createdAt;
        if (updatedAt) {
            this._updatedAt = updatedAt;
        }
        if (id) {
            this._id = id;
        }
    }

    get owner(): string  {
        return this._owner;
    }

    get description(): string {
        return this._description;
    }

    set description(description: string) {
        this._description = description;
    }

    get completed(): boolean {
        return this._completed;
    }

    set completed(completed: boolean) {
        this._completed = completed;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get id(): string {
        return this._id;
    }
}

