import { inject, injectable} from 'inversify';

import { TodoRepository } from '../repository/todo.repository';
import { ITodoDbModel } from '../model/todo.db.model';
import { TodoCreateRequest } from '../request/todo.create.request';
import { TodoEditRequest } from '../request/todo.edit.request';

@injectable()
export class TodoService {

    constructor(
        @inject(TodoRepository.name) private _todoRepository: TodoRepository
    ) { }

    public async findAll(): Promise<ITodoDbModel[]> {
        return await this._todoRepository.find({});
    }

    public async findById(_id: string): Promise<ITodoDbModel> {
        return await this._todoRepository.findById(_id);
    }

    public async create(todoRequest: TodoCreateRequest): Promise<ITodoDbModel> {
        return await this._todoRepository.create(todoRequest);
    }

    public async update(_id: string, todoRequest: TodoEditRequest): Promise<ITodoDbModel> {
        await this._todoRepository.update(_id, todoRequest);
        return await this._todoRepository.findById(_id);
    }

    public async delete(_id: string): Promise<boolean> {
        await this._todoRepository.delete(_id);
        return true;
    }
}
