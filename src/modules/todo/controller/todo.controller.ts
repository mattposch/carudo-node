import { Controller, interfaces, Post, Get, Patch, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';

import { validateBody } from '../../../core/util';

import { TodoService } from '../service/todo.service';
import { TodoCreateRequest } from '../request/todo.create.request';
import { TodoEditRequest } from '../request/todo.edit.request';

@Controller('/api/todos')
@injectable()
export class TodoController implements interfaces.Controller {

    constructor(
        @inject(TodoService.name) private _todoService: TodoService,
    ) { }

    @Get('/')
    public async findAll(request: Request): Promise<any> {
        return await this._todoService.findAll();
    }

    @Get('/:id')
    public async findById(request: Request): Promise<any> {
        return await this._todoService.findById(request.params.id);
    }

    @Post('/')
    public async create(request: Request, response: Response): Promise<void> {
        const todoRequest: TodoCreateRequest =
            await validateBody<TodoCreateRequest>(request, TodoCreateRequest);

        await this._todoService.create(todoRequest);
        response.send(204);
    }

    @Patch('/:id')
    public async update(request: Request, response: Response): Promise<void> {
        const todoRequest: TodoEditRequest =
            await validateBody<TodoEditRequest>(request, TodoEditRequest);

        await this._todoService.update(request.params.id, todoRequest);
        response.send(204);
    }

    @Delete('/:id')
    public async delete(request: Request, response: Response): Promise<void> {
        await this._todoService.delete(request.params.id);
        response.send(204);
    }
}
