import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { once } from 'events';
import { createWriteStream } from 'fs';
import * as fs from 'fs/promises';
import { WriteStreamChunkError } from '../errors/archive/WriteStreamChunkError';

@Injectable()
export class ArchiveService {
  private readonly logger = new Logger(ArchiveService.name);
  private readonly BASE_DIR = '.tmp/codeask';

  constructor() {}

  private getTempDirectoryName(id: string) {
    return `${this.BASE_DIR}/archives/temp-${id}`;
  }

  private async createTempDirectory() {
    const id = randomUUID();

    const path = this.getTempDirectoryName(id);
    await fs.mkdir(path, { recursive: true });

    return path;
  }

  async cleanupTempDirectory(path: string) {
    return fs.rmdir(path);
  }

  private createWriteStream(path: string) {
    return createWriteStream(path, {
      autoClose: true,
    });
  }

  async persistArchive(reader: ReadableStreamDefaultReader, path: string) {
    this.logger.debug(`starting archive persistence, path=${path}`);

    const writer = this.createWriteStream(path);
    writer.on('error', () => {
      this.logger.error(
        `archive persistence failed: failed to write stream chunk, path=${path}`,
      );
      throw new WriteStreamChunkError();
    });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const canContinue = writer.write(value);
      if (!canContinue) {
        await once(writer, 'drain');
      }
    }

    writer.end();
    await once(writer, 'finish');

    this.logger.debug(
      `archive persistence completed successfully, path=${path}`,
    );
  }
}
