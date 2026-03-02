export interface Board {
  id: string;
  name: string;
  description: string | null;
  columns: BoardColumn[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardColumn {
  id: string;
  name: string;
  order: number;
  boardId: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  order: number;
  columnId: string;
  createdAt: string;
  updatedAt: string;
}

// DTO interfaces

export interface CreateBoardDto {
  name: string;
  description?: string;
}

export interface UpdateBoardDto {
  name?: string;
  description?: string;
}

export interface CreateColumnDto {
  name: string;
  boardId: string;
}

export interface UpdateColumnDto {
  name?: string;
}

export interface ReorderColumnsDto {
  columnIds: string[];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  columnId: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
}

export interface MoveTaskDto {
  columnId: string;
  order: number;
}
