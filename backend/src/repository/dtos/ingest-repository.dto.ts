import { IsUrl, Matches } from 'class-validator';

export class IngestRepositoryDto {
  @IsUrl()
  @Matches(
    /^https:\/\/github\.com\/[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+\/?$/,
  )
  url!: string;
}
