import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { BoardColumn } from '../../columns/entities/board-column.entity';

@Entity('tasks')
export class Task extends BaseEntity {
  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column()
  columnId: string;

  @ManyToOne(() => BoardColumn, (column) => column.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'columnId' })
  column: BoardColumn;
}
