import { deserialize } from 'cerialize';
import { IsEmail, MinLength, IsNotEmpty, MaxLength, Matches } from 'class-validator';

import { IsEqualTo } from '../../../core/validation/is.equal.validation';
import { OptinalMax } from '../../../core/validation/optional.validation';
import { IBaseRequest } from '../../../core/base/base.request';

/**
 * User registration request.
 */
export class UserRegistrationRequest implements IBaseRequest {

    /** Name of the user */
    @deserialize
    @OptinalMax(100, { message:  'Text length must be smaller than 101'})
    public firstName: string;

    @deserialize
    @OptinalMax(100, { message:  'Text length must be smaller than 101'})
    public lastName: string;

    /** EMail of the user */
    @deserialize
    @IsEmail()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    @IsEqualTo('email2', {message: 'Emails must be equal'})
    public email: string;

    /** EMail of the user */
    @deserialize
    @IsEmail()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    public email2: string;

    /** Cleartext password of the user, 1st entry */
    @deserialize
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    @IsEqualTo('password2', {message: 'Passwords must be equal'})
    @Matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            {
                message: `Password is not complex enough: min 8 letters + use a combination of
                          symbols, numbers, upper & lower case letters`
            })
    public password: string;

    /** Cleartext password of the user, 2nd entry */
    @deserialize
    @IsNotEmpty()
    public password2: string;
}
