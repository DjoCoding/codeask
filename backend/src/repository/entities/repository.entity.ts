import { Ingestion } from '@/ingestion/entities/ingestion.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('repositories')
export class Repository {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  githubId!: string;

  @Column({
    type: 'varchar',
  })
  owner!: string;

  @Column({
    type: 'varchar',
  })
  name!: string;

  @Column({
    type: 'varchar',
    name: 'default_branch',
  })
  defaultBranch!: string;

  @OneToMany(() => Ingestion, (ingestion) => ingestion.repository)
  ingestions!: Ingestion[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
