import * as log from 'winston';
import * as Bluebird from 'bluebird';
import { inject, injectable } from 'inversify';
import { Core, Model, Configuration } from 'iridium';

import { TYPES } from '../../ioc/types';
import { IUserDBModel, UserDBModel } from './../../modules/user/model/user.db.model';
import { ITodoDbModel, TodoDbModel } from './../../modules/todo/model/todo.db.model';

@injectable()
export class Database extends Core {

    public users: Model<IUserDBModel, UserDBModel> =
        new Model<IUserDBModel, UserDBModel>(this, UserDBModel);

    public todos: Model<ITodoDbModel, TodoDbModel> =
        new Model<ITodoDbModel, TodoDbModel>(this, TodoDbModel);

    /**
     * @param uri       Connection URL
     * @param config    Optional database configuration
     */
    constructor(
        @inject(TYPES.DatabaseUrl) uri: string,
        @inject(TYPES.DatabaseConfig) config?: Configuration) {
        super(uri, config);
        log.debug(`Connecting to ${uri}`);
    }

     /**
      * onConnected callback: initializes all indexes.
      * @returns {Bluebird<any>}
      */
    protected onConnected(): Bluebird<any> {
        return Bluebird
            .all([
                this.users.ensureIndexes(),
                this.todos.ensureIndexes(),
            ]);
    }
}
