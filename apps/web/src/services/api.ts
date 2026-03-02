import axios from 'axios';
import type { Todo } from '@/types/todo';

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
