import axios from 'axios';
import type { Todo } from '@/types/todo';
import type {
  Board,
  BoardColumn,
  Task,
  CreateBoardDto,
  UpdateBoardDto,
  CreateColumnDto,
  UpdateColumnDto,
  ReorderColumnsDto,
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
} from '@/types/board';

const api = axios.create({
  baseURL: '/api',
});

export const todosApi = {
  getAll: () => api.get<Todo[]>('/todos').then((res) => res.data),
  getOne: (id: string) => api.get<Todo>(`/todos/${id}`).then((res) => res.data),
  create: (title: string) =>
    api.post<Todo>('/todos', { title }).then((res) => res.data),
  update: (id: string, data: Partial<Pick<Todo, 'title' | 'completed'>>) =>
    api.patch<Todo>(`/todos/${id}`, data).then((res) => res.data),
  remove: (id: string) => api.delete(`/todos/${id}`),
};

export const boardsApi = {
  getAll: () => api.get<Board[]>('/boards').then((res) => res.data),
  getOne: (id: string) => api.get<Board>(`/boards/${id}`).then((res) => res.data),
  create: (data: CreateBoardDto) =>
    api.post<Board>('/boards', data).then((res) => res.data),
  update: (id: string, data: UpdateBoardDto) =>
    api.patch<Board>(`/boards/${id}`, data).then((res) => res.data),
  remove: (id: string) => api.delete(`/boards/${id}`),
};

export const columnsApi = {
  getByBoard: (boardId: string) =>
    api.get<BoardColumn[]>(`/boards/${boardId}/columns`).then((res) => res.data),
  getOne: (id: string) =>
    api.get<BoardColumn>(`/columns/${id}`).then((res) => res.data),
  create: (data: CreateColumnDto) =>
    api.post<BoardColumn>('/columns', data).then((res) => res.data),
  update: (id: string, data: UpdateColumnDto) =>
    api.patch<BoardColumn>(`/columns/${id}`, data).then((res) => res.data),
  remove: (id: string) => api.delete(`/columns/${id}`),
  reorder: (boardId: string, data: ReorderColumnsDto) =>
    api.patch<BoardColumn[]>(`/boards/${boardId}/columns/reorder`, data).then((res) => res.data),
};

export const tasksApi = {
  getByColumn: (columnId: string) =>
    api.get<Task[]>(`/columns/${columnId}/tasks`).then((res) => res.data),
  getOne: (id: string) =>
    api.get<Task>(`/tasks/${id}`).then((res) => res.data),
  create: (data: CreateTaskDto) =>
    api.post<Task>('/tasks', data).then((res) => res.data),
  update: (id: string, data: UpdateTaskDto) =>
    api.patch<Task>(`/tasks/${id}`, data).then((res) => res.data),
  remove: (id: string) => api.delete(`/tasks/${id}`),
  move: (id: string, data: MoveTaskDto) =>
    api.patch<Task>(`/tasks/${id}/move`, data).then((res) => res.data),
};
