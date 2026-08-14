import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GithubAccount } from '../../auth/entities/github-account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'full_name',
  })
  displayName!: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  avatar!: string | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;

  @OneToOne(() => GithubAccount, (gu) => gu.user)
  githubAccount!: GithubAccount | null;
}
