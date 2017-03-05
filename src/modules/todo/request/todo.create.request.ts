import { deserialize } from 'cerialize';

import { IBaseRequest } from '../../../core/base/base.request';

export class TodoCreateRequest implements IBaseRequest {

    @deserialize
    public text: string;

}
