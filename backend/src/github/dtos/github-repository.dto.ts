export class GithubRepository {
  id!: string;
  name!: string;
  full_name!: string;
  private!: boolean;
  owner!: {
    login: string;
    id: string;
  };
  description!: string;
  url!: string;
  default_branch!: string;
  created_at!: string;
  updated_at!: string;
}
