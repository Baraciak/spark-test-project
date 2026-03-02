import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { BoardColumn } from '../../columns/entities/board-column.entity';

@Entity('boards')
export class Board extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @OneToMany(() => BoardColumn, (column) => column.board)
  columns: BoardColumn[];
}
