import { ITodoDbModel, TodoDbModel } from './../model/todo.db.model';
import { injectable, inject } from 'inversify';

import { BaseRepository } from '../../../core/base/base.repository';
import { Database } from '../../../core/database/database';
import { TYPES } from '../../../ioc/types';

@injectable()
export class TodoRepository
extends BaseRepository<ITodoDbModel, TodoDbModel> {

    /**
     * @param database Database singleton
     */
    constructor(@inject(TYPES.Database) _database: Database) {
        super();
        this.model = _database.todos;
    }
}
