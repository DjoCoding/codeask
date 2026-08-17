import { Body, Controller, Post } from '@nestjs/common';
import { IngestRepositoryDto } from './dtos/ingest-repository.dto';
import { RepositoryService } from './services/repository.service';

@Controller('repositories')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Post('/ingest')
  async ingest(@Body() dto: IngestRepositoryDto) {
    const { url } = dto;
    const ingestion = await this.repositoryService.ingest(url);
    return ingestion;
  }
}
