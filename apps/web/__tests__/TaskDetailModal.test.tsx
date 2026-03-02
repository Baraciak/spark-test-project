import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import boardsReducer from '../src/store/boardsSlice';
import TaskDetailModal from '../src/components/boards/TaskDetailModal';
import type { Task } from '../src/types/board';

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Task description here',
  order: 0,
  columnId: 'col-1',
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
};

function renderModal(task: Task = mockTask, onClose = jest.fn()) {
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

  return {
    onClose,
    ...render(
      <Provider store={store}>
        <TaskDetailModal
          task={task}
          boardId="board-1"
          open={true}
          onClose={onClose}
        />
      </Provider>,
    ),
  };
}

describe('TaskDetailModal', () => {
  it('renders task title and description', () => {
    renderModal();
    expect(screen.getByDisplayValue('Test Task')).toBeTruthy();
    expect(screen.getByDisplayValue('Task description here')).toBeTruthy();
  });

  it('renders created date', () => {
    renderModal();
    expect(screen.getByText(/Created:/)).toBeTruthy();
  });

  it('renders Task Details heading', () => {
    renderModal();
    expect(screen.getByText('Task Details')).toBeTruthy();
  });

  it('has a Delete button', () => {
    renderModal();
    expect(screen.getByText('Delete')).toBeTruthy();
  });

  it('disables Save when no changes', () => {
    renderModal();
    const saveButton = screen.getByText('Save') as HTMLButtonElement;
    expect(saveButton.disabled).toBe(true);
  });

  it('enables Save when title changes', () => {
    renderModal();
    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    const saveButton = screen.getByText('Save') as HTMLButtonElement;
    expect(saveButton.disabled).toBe(false);
  });

  it('shows delete confirmation dialog when Delete clicked', () => {
    renderModal();
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Delete Task')).toBeTruthy();
    expect(screen.getByText(/Delete "Test Task"/)).toBeTruthy();
  });

  it('calls onClose when Cancel clicked', () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('handles task without description', () => {
    const taskNoDesc: Task = { ...mockTask, description: null };
    renderModal(taskNoDesc);
    const descInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
    expect(descInput.value).toBe('');
  });
});
