import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import boardsReducer from '../src/store/boardsSlice';
import KanbanBoard from '../src/components/boards/KanbanBoard';
import type { Board } from '../src/types/board';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const mockBoard: Board = {
  id: 'board-1',
  name: 'Test Board',
  description: 'Test description',
  columns: [
    {
      id: 'col-1',
      name: 'To Do',
      order: 0,
      boardId: 'board-1',
      tasks: [
        {
          id: 'task-1',
          title: 'First Task',
          description: 'Task description',
          order: 0,
          columnId: 'col-1',
          createdAt: '2026-03-01T00:00:00.000Z',
          updatedAt: '2026-03-01T00:00:00.000Z',
        },
      ],
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    },
    {
      id: 'col-2',
      name: 'In Progress',
      order: 1,
      boardId: 'board-1',
      tasks: [],
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    },
  ],
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
};

function renderWithStore(board: Board) {
  const store = configureStore({
    reducer: { boards: boardsReducer },
    preloadedState: {
      boards: {
        items: [],
        activeBoard: board,
        listStatus: 'succeeded' as const,
        activeBoardStatus: 'succeeded' as const,
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <KanbanBoard board={board} />
    </Provider>,
  );
}

describe('KanbanBoard', () => {
  it('renders board name and description', () => {
    renderWithStore(mockBoard);
    expect(screen.getByText('Test Board')).toBeTruthy();
    expect(screen.getByText('Test description')).toBeTruthy();
  });

  it('renders back button to /boards', () => {
    renderWithStore(mockBoard);
    const backLink = screen.getByText('Boards');
    expect(backLink.closest('a')?.getAttribute('href')).toBe('/boards');
  });

  it('renders columns', () => {
    renderWithStore(mockBoard);
    expect(screen.getByText('To Do')).toBeTruthy();
    expect(screen.getByText('In Progress')).toBeTruthy();
  });

  it('renders tasks within columns', () => {
    renderWithStore(mockBoard);
    expect(screen.getByText('First Task')).toBeTruthy();
  });

  it('shows empty state when no columns', () => {
    const emptyBoard: Board = {
      ...mockBoard,
      columns: [],
    };
    renderWithStore(emptyBoard);
    expect(screen.getByText('No columns yet')).toBeTruthy();
    expect(screen.getByText('Add your first column to get started')).toBeTruthy();
  });

  it('does not show description when null', () => {
    const boardWithoutDesc: Board = {
      ...mockBoard,
      description: null,
    };
    renderWithStore(boardWithoutDesc);
    expect(screen.getByText('Test Board')).toBeTruthy();
    expect(screen.queryByText('Test description')).toBeNull();
  });
});
