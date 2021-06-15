import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}
  // private tasks = [];
  // getAllTasks() {
  //   return this.tasks;
  // }
  // getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }
  async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    // return this.taskRepository.query('select * from public.task');
    return this.taskRepository.getTasks(filterDto, user);
  }
  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskById(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const updated = await this.getTaskById(id);
    const { title, description, status } = updateTaskDto;
    updated.title = title;
    updated.description = description;
    updated.status = status;
    await updated.save();
    return updated;
  }

  async deleteTaskById(id: string): Promise<Task> {
    const taskToDelete = await this.getTaskById(id);
    return await taskToDelete.remove();
  }

  // createTask(createTaskDto: CreateTaskDto) {
  //   const { title, description } = createTaskDto;
  //   const tasks: Task = {
  //     id: uuid.v4(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(tasks);
  //   return tasks;
  // }
  // updateTaskById(id: string, updateTaskDto: UpdateTaskDto) {
  //   const { title, description, status } = updateTaskDto;
  //   let task: UpdateTaskDto = this.tasks.find((task) => task.id === id);
  //   task = { title, description, status };
  //   this.tasks.find((task) => task.id === id).title = title;
  //   this.tasks.find((task) => task.id === id).description = description;
  //   this.tasks.find((task) => task.id === id).status = status;
  //   return task;
  // }
  // deleteTaskById(id: string): Task[] {
  //   const newTasks = this.tasks.filter((task) => task.id !== id);
  //   this.tasks = [...newTasks];
  //   return newTasks;
  // }
}
