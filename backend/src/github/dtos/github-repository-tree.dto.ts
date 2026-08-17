export class GithubRepositoryTreeItem {
  path!: string;
  mode!: string;
  type!: string;
  sha!: string;
  size!: number;
  url!: string;
}

export class GithubRepositoryTree {
  sha!: string;
  url!: string;
  tree!: GithubRepositoryTreeItem[];
}
