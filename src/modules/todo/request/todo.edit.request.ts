import { deserialize } from 'cerialize';

import { IBaseRequest } from '../../../core/base/base.request';

export class TodoEditRequest implements IBaseRequest {

    @deserialize
    public isDone?: boolean;

    @deserialize
    public text?: string;

}
