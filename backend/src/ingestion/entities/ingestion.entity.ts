import { Repository } from '@/repository/entities/repository.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IngestionStatus } from '../enums/ingestion-status.enum';

@Entity('ingestions')
@Index(['repositoryId', 'commitSha'], { unique: true })
export class Ingestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Repository, (repo) => repo.ingestions)
  @JoinColumn({ name: 'repository_id' })
  repository!: Repository;

  @Column({
    name: 'repository_id',
    type: 'uuid',
  })
  repositoryId!: string;
  
  @Column({
    type: 'varchar',
    name: 'commit_sha',
  })
  commitSha!: string;

  @Column({
    type: 'enum',
    enum: IngestionStatus,
    default: IngestionStatus.PENDING,
  })
  status!: IngestionStatus;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
