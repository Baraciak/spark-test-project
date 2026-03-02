import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Board } from '../../boards/entities/board.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('board_columns')
export class BoardColumn extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column()
  boardId: string;

  @ManyToOne(() => Board, (board) => board.columns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board: Board;

  @OneToMany(() => Task, (task) => task.column)
  tasks: Task[];
}
