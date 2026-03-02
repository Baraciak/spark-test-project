import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';
import boardsReducer from './boardsSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    boards: boardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
