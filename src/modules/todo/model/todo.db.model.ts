import { serializeAs } from 'cerialize';
import { Instance, Collection, ObjectID, Property } from 'iridium';

export interface ITodoDbModel  {
    _id?: string;
    createdOn?: Date;
    isDone?: boolean;
    modifiedOn?: Date;
    text?: string;
}

@Collection('Todo')
export class TodoDbModel
extends Instance<ITodoDbModel, TodoDbModel>
implements ITodoDbModel {

    /** MongoDB document id */
    @serializeAs(String, 'id')
    @ObjectID
    public _id: string;

    @Property(Date)
    public createdOn?: Date;

    @Property(Boolean)
    public isDone?: boolean;

    @Property(Date)
    public modifiedOn?: Date;

    @Property(String)
    public text?: string;

    public static onCreating(todo: TodoDbModel) {
        todo.createdOn = new Date();
        todo.modifiedOn = new Date();
        todo.isDone = false;
    }
}
