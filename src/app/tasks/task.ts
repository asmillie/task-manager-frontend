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

    constructor(description: string, completed: boolean, owner?: string, id?: string, createdAt?: Date, updatedAt?: Date) {
        this._description = description;
        this._completed = completed;
        this._owner = this.owner ? this.owner : undefined;
        this._id = this.id ? this.id : undefined;
        this._createdAt = this.createdAt ? this.createdAt : undefined;
        this._updatedAt = this.updatedAt ? this.updatedAt : undefined;
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

