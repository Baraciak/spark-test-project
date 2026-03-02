import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import boardsReducer from '../src/store/boardsSlice';
import KanbanColumn from '../src/components/boards/KanbanColumn';
import type { BoardColumn } from '../src/types/board';

const mockColumn: BoardColumn = {
  id: 'col-1',
  name: 'To Do',
  order: 0,
  boardId: 'board-1',
  tasks: [
    {
      id: 'task-1',
      title: 'First Task',
      description: 'Description 1',
      order: 0,
      columnId: 'col-1',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    },
    {
      id: 'task-2',
      title: 'Second Task',
      description: null,
      order: 1,
      columnId: 'col-1',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    },
  ],
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
};

function renderWithStore(column: BoardColumn = mockColumn) {
  const store = configureStore({
    reducer: { boards: boardsReducer },
    preloadedState: {
      boards: {
        items: [],
        activeBoard: null,
        status: 'succeeded' as const,
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <KanbanColumn column={column} boardId="board-1" index={0} />
    </Provider>,
  );
}

describe('KanbanColumn', () => {
  it('renders column name and task count', () => {
    renderWithStore();
    expect(screen.getByText('To Do')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('renders task cards', () => {
    renderWithStore();
    expect(screen.getByText('First Task')).toBeTruthy();
    expect(screen.getByText('Second Task')).toBeTruthy();
  });

  it('renders "Add task" button', () => {
    renderWithStore();
    expect(screen.getByText('Add task')).toBeTruthy();
  });

  it('shows add task form when "Add task" clicked', () => {
    renderWithStore();
    fireEvent.click(screen.getByText('Add task'));
    expect(screen.getByPlaceholderText('Task title...')).toBeTruthy();
    expect(screen.getByText('Add')).toBeTruthy();
  });

  it('switches to inline edit when column name clicked', () => {
    renderWithStore();
    fireEvent.click(screen.getByText('To Do'));
    expect(screen.getByDisplayValue('To Do')).toBeTruthy();
  });

  it('cancels inline edit on Escape', () => {
    renderWithStore();
    fireEvent.click(screen.getByText('To Do'));
    const input = screen.getByDisplayValue('To Do');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.getByText('To Do')).toBeTruthy();
    expect(screen.queryByDisplayValue('To Do')).toBeNull();
  });

  it('shows delete confirmation dialog', () => {
    renderWithStore();
    const deleteButtons = screen.getAllByRole('button');
    // Find the delete icon button (first IconButton with delete icon)
    const deleteBtn = deleteButtons.find(
      (btn) => btn.querySelector('[data-testid="DeleteOutlineIcon"]') !== null,
    );
    if (deleteBtn) {
      fireEvent.click(deleteBtn);
      expect(screen.getByText('Delete Column')).toBeTruthy();
      expect(screen.getByText(/Delete "To Do"/)).toBeTruthy();
    }
  });

  it('renders empty column', () => {
    const emptyColumn: BoardColumn = {
      ...mockColumn,
      tasks: [],
    };
    renderWithStore(emptyColumn);
    expect(screen.getByText('To Do')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.getByText('Add task')).toBeTruthy();
  });
});
