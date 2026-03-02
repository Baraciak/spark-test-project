import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Todo } from '@/types/todo';
import { todosApi } from '@/services/api';

export interface TodosState {
  items: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchAll', async () => {
  return todosApi.getAll();
});

export const addTodo = createAsyncThunk(
  'todos/add',
  async (title: string) => {
    return todosApi.create(title);
  },
);

export const toggleTodo = createAsyncThunk(
  'todos/toggle',
  async (todo: Todo) => {
    return todosApi.update(todo.id, { completed: !todo.completed });
  },
);

export const removeTodo = createAsyncThunk(
  'todos/remove',
  async (id: string) => {
    await todosApi.remove(id);
    return id;
  },
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch todos';
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (t) => t.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export default todosSlice.reducer;
