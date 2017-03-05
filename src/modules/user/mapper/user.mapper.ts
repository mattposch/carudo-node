import { IUserDBModel } from './../model/user.db.model';
import { UserRegistrationRequest } from './../request/user.registration.request';
import * as _ from 'lodash';


export class UserMapper {

    public static mapUserRegistrationToDB(request: UserRegistrationRequest): IUserDBModel {
        const mapped: IUserDBModel = {
            email: request.email,
            firstName: request.firstName,
            lastName: request.lastName,
            password: request.password,
        };

        // remove null && undefined fields
        const result: IUserDBModel = <IUserDBModel>_.omitBy(mapped, _.isNil);

        return result;
    }

    public static mapUserToVM(user: IUserDBModel): IUserDBModel {
         const mapped: IUserDBModel = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            state: user.state,
        };

        return mapped;
    }
}
