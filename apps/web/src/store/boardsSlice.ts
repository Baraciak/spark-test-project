import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  Board,
  CreateBoardDto,
  UpdateBoardDto,
  CreateColumnDto,
  UpdateColumnDto,
  ReorderColumnsDto,
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
} from '@/types/board';
import { boardsApi, columnsApi, tasksApi } from '@/services/api';

export interface BoardsState {
  items: Board[];
  activeBoard: Board | null;
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  activeBoardStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BoardsState = {
  items: [],
  activeBoard: null,
  listStatus: 'idle',
  activeBoardStatus: 'idle',
  error: null,
};

// ── Board thunks ──

export const fetchBoards = createAsyncThunk('boards/fetchAll', async () => {
  return boardsApi.getAll();
});

export const fetchBoard = createAsyncThunk(
  'boards/fetchOne',
  async (id: string) => {
    return boardsApi.getOne(id);
  },
);

export const addBoard = createAsyncThunk(
  'boards/add',
  async (data: CreateBoardDto) => {
    return boardsApi.create(data);
  },
);

export const updateBoard = createAsyncThunk(
  'boards/update',
  async ({ id, data }: { id: string; data: UpdateBoardDto }) => {
    return boardsApi.update(id, data);
  },
);

export const removeBoard = createAsyncThunk(
  'boards/remove',
  async (id: string) => {
    await boardsApi.remove(id);
    return id;
  },
);

// ── Column thunks ──

export const addColumn = createAsyncThunk(
  'boards/addColumn',
  async (data: CreateColumnDto) => {
    await columnsApi.create(data);
    return boardsApi.getOne(data.boardId);
  },
);

export const updateColumn = createAsyncThunk(
  'boards/updateColumn',
  async ({
    id,
    data,
    boardId,
  }: {
    id: string;
    data: UpdateColumnDto;
    boardId: string;
  }) => {
    await columnsApi.update(id, data);
    return boardsApi.getOne(boardId);
  },
);

export const removeColumn = createAsyncThunk(
  'boards/removeColumn',
  async ({ id, boardId }: { id: string; boardId: string }) => {
    await columnsApi.remove(id);
    return boardsApi.getOne(boardId);
  },
);

export const reorderColumns = createAsyncThunk(
  'boards/reorderColumns',
  async ({
    boardId,
    columnIds,
  }: {
    boardId: string;
    columnIds: ReorderColumnsDto['columnIds'];
  }) => {
    await columnsApi.reorder(boardId, { columnIds });
    return boardsApi.getOne(boardId);
  },
);

// ── Task thunks ──

export const addTask = createAsyncThunk(
  'boards/addTask',
  async ({ data, boardId }: { data: CreateTaskDto; boardId: string }) => {
    await tasksApi.create(data);
    return boardsApi.getOne(boardId);
  },
);

export const updateTask = createAsyncThunk(
  'boards/updateTask',
  async ({
    id,
    data,
    boardId,
  }: {
    id: string;
    data: UpdateTaskDto;
    boardId: string;
  }) => {
    await tasksApi.update(id, data);
    return boardsApi.getOne(boardId);
  },
);

export const removeTask = createAsyncThunk(
  'boards/removeTask',
  async ({ id, boardId }: { id: string; boardId: string }) => {
    await tasksApi.remove(id);
    return boardsApi.getOne(boardId);
  },
);

export const moveTask = createAsyncThunk(
  'boards/moveTask',
  async ({
    id,
    data,
    boardId,
  }: {
    id: string;
    data: MoveTaskDto;
    boardId: string;
  }) => {
    await tasksApi.move(id, data);
    return boardsApi.getOne(boardId);
  },
);

// ── Slice ──

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchBoards
      .addCase(fetchBoards.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch boards';
      })
      // fetchBoard
      .addCase(fetchBoard.pending, (state) => {
        state.activeBoardStatus = 'loading';
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.activeBoardStatus = 'succeeded';
        state.activeBoard = action.payload;
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.activeBoardStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch board';
      })
      // addBoard
      .addCase(addBoard.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // updateBoard
      .addCase(updateBoard.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // removeBoard
      .addCase(removeBoard.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
        if (state.activeBoard?.id === action.payload) {
          state.activeBoard = null;
        }
      })
      // Column mutations → re-fetched activeBoard
      .addCase(addColumn.fulfilled, (state, action) => {
        state.activeBoard = action.payload;
      })
      .addCase(updateColumn.fulfilled, (state, action) => {
        state.activeBoard = action.payload;
      })
      .addCase(removeColumn.fulfilled, (state, action) => {
        state.activeBoard = action.payload;
      })
      .addCase(reorderColumns.fulfilled, (state, action) => {
        state.activeBoard = action.payload;
      })
      // Task mutations → re-fetched activeBoard
      .addCase(addTask.fulfilled, (state, action) => {
        state.activeBoard = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.activeBoard = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.activeBoard = action.payload;
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        state.activeBoard = action.payload;
      });
  },
});

export default boardsSlice.reducer;
