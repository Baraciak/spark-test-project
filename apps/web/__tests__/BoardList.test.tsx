import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import boardsReducer from '../src/store/boardsSlice';
import BoardList from '../src/components/boards/BoardList';

function renderWithStore(preloadedState = {}) {
  const store = configureStore({
    reducer: { boards: boardsReducer },
    preloadedState: {
      boards: {
        items: [],
        activeBoard: null,
        status: 'succeeded' as const,
        error: null,
        ...preloadedState,
      },
    },
  });

  return render(
    <Provider store={store}>
      <BoardList />
    </Provider>,
  );
}

describe('BoardList', () => {
  it('shows empty state when no boards', () => {
    renderWithStore();
    expect(screen.getByText('No boards yet')).toBeTruthy();
  });

  it('renders board cards', () => {
    renderWithStore({
      items: [
        {
          id: '1',
          name: 'Sprint 1',
          description: 'First sprint board',
          columns: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });
    expect(screen.getByText('Sprint 1')).toBeTruthy();
    expect(screen.getByText('First sprint board')).toBeTruthy();
  });

  it('renders multiple boards', () => {
    renderWithStore({
      items: [
        {
          id: '1',
          name: 'Sprint 1',
          description: null,
          columns: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Sprint 2',
          description: 'Second sprint',
          columns: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });
    expect(screen.getByText('Sprint 1')).toBeTruthy();
    expect(screen.getByText('Sprint 2')).toBeTruthy();
  });

  it('shows "No description" for boards without description', () => {
    renderWithStore({
      items: [
        {
          id: '1',
          name: 'Empty Board',
          description: null,
          columns: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });
    expect(screen.getByText('No description')).toBeTruthy();
  });
});
