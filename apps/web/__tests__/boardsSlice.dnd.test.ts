import { configureStore } from '@reduxjs/toolkit';
import boardsReducer, {
  moveTaskOptimistic,
  revertOptimisticMove,
  reorderColumnsOptimistic,
  type BoardsState,
} from '../src/store/boardsSlice';
import type { Board } from '../src/types/board';

const mockBoard: Board = {
  id: 'board-1',
  name: 'Test Board',
  description: null,
  columns: [
    {
      id: 'col-1',
      name: 'To Do',
      order: 0,
      boardId: 'board-1',
      tasks: [
        {
          id: 'task-1',
          title: 'Task A',
          description: null,
          order: 0,
          columnId: 'col-1',
          createdAt: '2026-03-01T00:00:00.000Z',
          updatedAt: '2026-03-01T00:00:00.000Z',
        },
        {
          id: 'task-2',
          title: 'Task B',
          description: null,
          order: 1,
          columnId: 'col-1',
          createdAt: '2026-03-01T00:00:00.000Z',
          updatedAt: '2026-03-01T00:00:00.000Z',
        },
        {
          id: 'task-3',
          title: 'Task C',
          description: null,
          order: 2,
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
      tasks: [
        {
          id: 'task-4',
          title: 'Task D',
          description: null,
          order: 0,
          columnId: 'col-2',
          createdAt: '2026-03-01T00:00:00.000Z',
          updatedAt: '2026-03-01T00:00:00.000Z',
        },
      ],
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    },
    {
      id: 'col-3',
      name: 'Done',
      order: 2,
      boardId: 'board-1',
      tasks: [],
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    },
  ],
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
};

function createStore(board: Board = mockBoard) {
  return configureStore({
    reducer: { boards: boardsReducer },
    preloadedState: {
      boards: {
        items: [],
        activeBoard: board,
        listStatus: 'succeeded',
        activeBoardStatus: 'succeeded',
        error: null,
      } as BoardsState,
    },
  });
}

describe('boardsSlice DnD reducers', () => {
  describe('moveTaskOptimistic', () => {
    it('moves task between columns', () => {
      const store = createStore();

      store.dispatch(
        moveTaskOptimistic({
          taskId: 'task-1',
          sourceColumnId: 'col-1',
          sourceIndex: 0,
          destinationColumnId: 'col-2',
          destinationIndex: 1,
        }),
      );

      const state = store.getState().boards;
      const col1 = state.activeBoard!.columns.find((c) => c.id === 'col-1')!;
      const col2 = state.activeBoard!.columns.find((c) => c.id === 'col-2')!;

      // Task removed from source
      expect(col1.tasks).toHaveLength(2);
      expect(col1.tasks.map((t) => t.id)).toEqual(['task-2', 'task-3']);

      // Task added to destination at index 1
      expect(col2.tasks).toHaveLength(2);
      expect(col2.tasks[1].id).toBe('task-1');
      expect(col2.tasks[1].columnId).toBe('col-2');

      // Orders re-indexed
      expect(col1.tasks[0].order).toBe(0);
      expect(col1.tasks[1].order).toBe(1);
      expect(col2.tasks[0].order).toBe(0);
      expect(col2.tasks[1].order).toBe(1);
    });

    it('moves task to empty column', () => {
      const store = createStore();

      store.dispatch(
        moveTaskOptimistic({
          taskId: 'task-1',
          sourceColumnId: 'col-1',
          sourceIndex: 0,
          destinationColumnId: 'col-3',
          destinationIndex: 0,
        }),
      );

      const state = store.getState().boards;
      const col3 = state.activeBoard!.columns.find((c) => c.id === 'col-3')!;

      expect(col3.tasks).toHaveLength(1);
      expect(col3.tasks[0].id).toBe('task-1');
      expect(col3.tasks[0].columnId).toBe('col-3');
      expect(col3.tasks[0].order).toBe(0);
    });

    it('reorders task within same column', () => {
      const store = createStore();

      // Move Task A from index 0 to index 2 => [B, C, A]
      store.dispatch(
        moveTaskOptimistic({
          taskId: 'task-1',
          sourceColumnId: 'col-1',
          sourceIndex: 0,
          destinationColumnId: 'col-1',
          destinationIndex: 2,
        }),
      );

      const state = store.getState().boards;
      const col1 = state.activeBoard!.columns.find((c) => c.id === 'col-1')!;

      expect(col1.tasks.map((t) => t.id)).toEqual(['task-2', 'task-3', 'task-1']);
      expect(col1.tasks[0].order).toBe(0);
      expect(col1.tasks[1].order).toBe(1);
      expect(col1.tasks[2].order).toBe(2);
    });

    it('reorders task C to position 0 within same column', () => {
      const store = createStore();

      // Move Task C from index 2 to index 0 => [C, A, B]
      store.dispatch(
        moveTaskOptimistic({
          taskId: 'task-3',
          sourceColumnId: 'col-1',
          sourceIndex: 2,
          destinationColumnId: 'col-1',
          destinationIndex: 0,
        }),
      );

      const state = store.getState().boards;
      const col1 = state.activeBoard!.columns.find((c) => c.id === 'col-1')!;

      expect(col1.tasks.map((t) => t.id)).toEqual(['task-3', 'task-1', 'task-2']);
    });
  });

  describe('revertOptimisticMove', () => {
    it('restores state after failed move', () => {
      const store = createStore();

      // Save original state
      const originalBoard = store.getState().boards.activeBoard;

      // Perform optimistic move (this saves snapshot)
      store.dispatch(
        moveTaskOptimistic({
          taskId: 'task-1',
          sourceColumnId: 'col-1',
          sourceIndex: 0,
          destinationColumnId: 'col-2',
          destinationIndex: 0,
        }),
      );

      // Verify move happened
      const movedState = store.getState().boards;
      expect(
        movedState.activeBoard!.columns.find((c) => c.id === 'col-1')!.tasks,
      ).toHaveLength(2);

      // Revert
      store.dispatch(revertOptimisticMove());

      // Verify state restored
      const revertedState = store.getState().boards;
      const col1 = revertedState.activeBoard!.columns.find((c) => c.id === 'col-1')!;
      expect(col1.tasks).toHaveLength(3);
      expect(col1.tasks.map((t) => t.id)).toEqual(['task-1', 'task-2', 'task-3']);

      // Deep equality with original
      expect(revertedState.activeBoard!.columns).toEqual(originalBoard!.columns);
    });
  });

  describe('reorderColumnsOptimistic', () => {
    it('reorders columns', () => {
      const store = createStore();

      // Move "Done" (index 2) to index 1
      store.dispatch(
        reorderColumnsOptimistic({
          sourceIndex: 2,
          destinationIndex: 1,
        }),
      );

      const state = store.getState().boards;
      const columnNames = state.activeBoard!.columns.map((c) => c.name);
      expect(columnNames).toEqual(['To Do', 'Done', 'In Progress']);

      // Orders re-indexed
      expect(state.activeBoard!.columns[0].order).toBe(0);
      expect(state.activeBoard!.columns[1].order).toBe(1);
      expect(state.activeBoard!.columns[2].order).toBe(2);
    });
  });
});
