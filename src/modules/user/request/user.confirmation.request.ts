import { IBaseRequest } from '../../../core/base/base.request';
import { deserialize } from 'cerialize';
import {MaxLength} from 'class-validator';
export class UserConfirmationRequest implements IBaseRequest {

    @deserialize
    @MaxLength(100)
    public id: string;

}
