import {injectable} from 'inversify';
import {Instance, Model, toObjectID} from 'iridium';
import {NotFoundException} from '../error/exception/notfound.exception';

import * as _ from 'lodash';

/**
 * Abstract base repository for easy repository creating.
 */
@injectable()
export abstract class BaseRepository<U, T extends Instance<U, T>> {
    /** Collection model, must be set in the successor */
    protected model: Model<U, T>;

    /**
     * Inserts an object into the collection after validating it against this model's schema.
     * @param   item The item to insert into the collection
     * @returns {Promise<T>}
     */
    public create(item: U): Promise<any> {
        return Promise.resolve(this.model.insert(item))
            .then((newItem) => {
                return newItem.document;
            });
    }

    /**
     * Returns all documents in the collection which match the conditions or null.
     * @param   conditions The MongoDB query dictating which documents to return
     * @returns {Promise<any>}
     */
    public find(conditions?: any, limit?: number, sortOptions?: any): Promise<any> {
        let query = this.model.find(conditions);
        if (!!limit) {
            query = query.limit(limit);
        }

        if (!!sortOptions) {
            query = query.sort(sortOptions);
        }


        return Promise.resolve(query ? query.toArray() : undefined);
    }

    /**
     * Returns the document in the collection which match the conditions or null.
     * @param   conditions The MongoDB query dictating which document to return
     * @returns {Promise<T>}
     */
    public findOne(conditions?: any): Promise<any> {
        return Promise.resolve(this.model.findOne(conditions));
    }

    /**
     * Returns the document in the collection with the given id.
     * Throws an exception if not found.
     * @param   id The given id identifiying the document to return
     * @returns {Promise<T>}
     */
    public findById(_id: string): Promise<any> {
        return Promise
            .resolve(this.model.findOne(_id))
            .then((item) => {
                if (item === null) {
                    throw new NotFoundException(`Item with ${_id} not found.`);
                }
                return item;
            });
    }

    /**
     * Updates the document in the collection with the given id.
     * Throws an exception if not found.
     * @param   _id The given id identifiying the document to delete
     * @param   item The item to insert into the collection
     * @returns {Promise<number>} number of updated documents
     */
    public update(_id: string, item: any): Promise<void> {
        // convert string based id in Object ID
        if (item._id) {
            item._id = toObjectID(item._id);
        }

        item.modifiedOn = new Date();

        const toAdd: any = _.pickBy(item, (x) => { return x !== undefined; });
        const toRemove: any = _.pickBy(item, (x) => { return x === undefined; });

        // perform the update
        return Promise
            .resolve(this.updateHelper(_id, toAdd, toRemove))
            .then((count: number) => {
                if (count === 0) {
                    throw new NotFoundException(`Item with ${_id} not found.`);
                }
            });
    }

    /**
     * Deletes the document in the collection with the given id.
     * Throws an exception if not found.
     * @param   _id The given id identifiying the document to delete
     * @returns {Promise<T>} number of deleted rows
     */
    public delete(_id: string): Promise<void> {
        return Promise
            .resolve(this.model.remove(_id))
            .then((count) => {
                if (count === 0) {
                    throw new NotFoundException(`Item with ${_id} not found.`);
                }
            });
    }

    private updateHelper(_id: string, toAdd: any, toRemove: any): Promise<number> {
        if (Object.keys(toAdd).length > 0 && Object.keys(toRemove).length > 0) {
            return Promise.resolve(this.model.update({ _id: _id }, {  $unset: toRemove, $set: toAdd }));
        } else if (Object.keys(toAdd).length > 0) {
            return Promise.resolve(this.model.update({ _id: _id }, {  $set: toAdd }));
        } else if (Object.keys(toRemove).length > 0) {
            return Promise.resolve(this.model.update({ _id: _id }, {  $unset: toRemove }));
        } else {
            return Promise.resolve(0);
        }
    }
}
