import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { INGEST_REPOSITORY_JOB } from '../constants/jobs';
import { REPOSITORY_INGESTION_QUEUE } from '../constants/queues';
import { IngestRepositoryJobPayload } from '../dtos/ingest-repository-job-payload.dto';
import { IngestionService } from '../services/ingestion.service';

@Processor(REPOSITORY_INGESTION_QUEUE)
export class IngestionProcessor extends WorkerHost {
  private readonly logger = new Logger(IngestionProcessor.name);

  constructor(private readonly ingestionService: IngestionService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case INGEST_REPOSITORY_JOB:
        return this.ingestRepository(job.data);
      default:
        throw new Error('invalid job');
    }
  }

  async ingestRepository(payload: IngestRepositoryJobPayload) {
    const { ingestionId } = payload;
    this.logger.log(`received ingestion job, ingestionId=${ingestionId}`);

    return (
      this.ingestionService
        .run(ingestionId)
        // .finally(() => this.ingestionService.cleanUpWorkspace(ingestionId))
        .then(() =>
          this.logger.log(
            `ingestion job successfully finished, ingestionId=${ingestionId}`,
          ),
        )
        .catch(async () => {
          await this.ingestionService.markAsFailed(ingestionId);
          this.logger.error(`ingestion job failed, ingestionId=${ingestionId}`);
        })
    );
  }
}
