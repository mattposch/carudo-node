import { serializeAs, serialize } from 'cerialize';
import { Instance, Collection, Index, ObjectID, Property, Transform } from 'iridium';
import { UserState } from './userstate.db.model';

export interface IUserDBModel  {
    _id?: string;
    createdOn?: Date;
    email?: string;
    emailHash?: string;
    emailSentOn?: Date;
    firstName?: string;
    jwt?: string;
    lastName?: string;
    modifiedOn?: Date;
    password?: string;
    passwordreset?: string;
    state?: UserState;
}

@Index({ email: 1 }, { unique: true })
@Index({ 'emailHash': 1 }, { unique: true, sparse: true})
@Index({ 'passwordreset': 1 }, { unique: true, sparse: true})
@Index({ 'emailSentOn': 1 }, {
    expireAfterSeconds: 3 * 60 * 60 * 24
})
@Collection('User')
export class UserDBModel
    extends Instance<IUserDBModel, UserDBModel>
    implements IUserDBModel {

    /** MongoDB document id */
    @serializeAs(String, 'id')
    @ObjectID
    public _id: string;

    @Property(Date)
    public createdOn?: Date;

    @serialize
    @Property(String)
    @Transform(s => s, s => s.toLowerCase())
    public email?: string;

    @Property(String, false)
    public emailHash?: string;

    @Property(Date, false)
    public emailSentOn?: Date;

    @serialize
    @Property(String, false)
    public firstName?: string;

    @serialize
    @Property(String, false)
    public lastName?: string;

    @Property(Date)
    public modifiedOn?: Date;

    @Property(String)
    public password?: string;

    @Property(String, false)
    public passwordreset?: string;

    @Property(String)
    public state?: UserState;

    public static onSaving(user: UserDBModel) {
        user.modifiedOn = new Date();
    }

    public static onCreating(user: UserDBModel) {
        user.createdOn = new Date();
        user.modifiedOn = new Date();
        user.emailSentOn = new Date();
    }

    public toString(): string {
        return `User: ${this.firstName} ${this.lastName} (${this.email}) | ${this._id}`;
    }
}
