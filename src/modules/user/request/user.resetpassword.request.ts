import { deserialize } from 'cerialize';
import { injectable } from 'inversify';
import { IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

import { IBaseRequest } from '../../../core/base/base.request';
import { OptinalMax } from '../../../core/validation/optional.validation';

@injectable()
export class ResetPasswordRequest implements IBaseRequest {

    @deserialize
    @OptinalMax(100, { message: 'Text is too long'})
    public id?: string;

    @deserialize
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    @Matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            {
                message: `Password not complex enough: min 8 letters 
                          & one symbol & one upper & one lower case & a number`
            })
    public password: string;

    @deserialize
    @IsNotEmpty()
    public password2: string;
}
