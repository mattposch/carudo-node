import { IUserDBModel, UserDBModel } from './../model/user.db.model';
import {injectable, inject} from 'inversify';

import {BaseRepository} from '../../../core/base/base.repository';
import {Database} from '../../../core/database/database';
import {TYPES} from '../../../ioc/types';

/**
 * Storage space repository.
 * The repository has to initialise the model.
 */
@injectable()
export class UserRepository
extends BaseRepository<IUserDBModel, UserDBModel> {

    /**
     * Ctor.
     * @param database Database singleton
     */
    constructor(@inject(TYPES.Database) database: Database) {
        super();
        this.model = database.users;
    }
}
