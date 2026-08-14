import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('github_accounts')
export class GithubAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (user) => user.githubAccount)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_github_account_user',
    referencedColumnName: 'id',
  })
  user!: User;

  @RelationId((githubAccount: GithubAccount) => githubAccount.user)
  userId!: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'github_id',
  })
  githubId!: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  username!: string;

  @Column({
    type: 'varchar',
    name: 'access_token',
  })
  accessToken!: string;

  @Column({
    type: 'varchar',
    name: 'refresh_token',
  })
  refreshToken!: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
