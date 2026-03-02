import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import todosReducer from '../src/store/todosSlice';
import TodoList from '../src/components/todos/TodoList';

function renderWithStore(preloadedState = {}) {
  const store = configureStore({
    reducer: { todos: todosReducer },
    preloadedState: {
      todos: {
        items: [],
        status: 'succeeded' as const,
        error: null,
        ...preloadedState,
      },
    },
  });

  return render(
    <Provider store={store}>
      <TodoList />
    </Provider>,
  );
}

describe('TodoList', () => {
  it('shows empty state when no todos', () => {
    renderWithStore();
    expect(screen.getByText('No todos yet')).toBeTruthy();
  });

  it('renders todo items', () => {
    renderWithStore({
      items: [
        {
          id: '1',
          title: 'Test Task',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });
    expect(screen.getByText('Test Task')).toBeTruthy();
  });

  it('renders multiple todos', () => {
    renderWithStore({
      items: [
        {
          id: '1',
          title: 'First',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Second',
          completed: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });
    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Second')).toBeTruthy();
  });
});
