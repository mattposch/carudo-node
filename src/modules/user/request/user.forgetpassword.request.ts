import { IBaseRequest } from '../../../core/base/base.request';
import { deserialize } from 'cerialize';
import {MaxLength, IsEmail} from 'class-validator';
export class ForgetPasswordRequest implements IBaseRequest {

    @deserialize
    @MaxLength(100)
    @IsEmail()
    public email: string;
}
