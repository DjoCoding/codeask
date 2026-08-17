import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'node:fs';
import path from 'node:path';
import unzipper from 'unzipper';
import { ExtractionError } from '../errors/extraction/ExtractionError';
import { ExtractionService } from '../interfaces/extraction-service.interface';

@Injectable()
export class ZipExtractionService implements ExtractionService {
  private readonly logger = new Logger(ZipExtractionService.name);

  constructor() {}

  private stripRootDirectory(relativePath: string) {
    const parts = relativePath.split(path.sep);
    parts.shift();
    return parts.join(path.sep);
  }

  private getEntryPath(destinationPath: string, entry: unzipper.Entry) {
    const relativePath = entry.path;
    const pathWithoutRoot = this.stripRootDirectory(relativePath);
    return path.join(destinationPath, pathWithoutRoot);
  }

  private createDirectory(path: string) {
    return fs.mkdirSync(path, {
      recursive: true,
    });
  }

  private createReadStream(path: string) {
    return fs.createReadStream(path);
  }

  private createWriteStream(path: string) {
    return fs.createWriteStream(path);
  }

  async extract(sourcePath: string, destinationPath: string) {
    this.logger.debug(`starting extraction, sourcePath=${sourcePath}`);

    this.createDirectory(destinationPath);
    const reader = this.createReadStream(sourcePath);

    return new Promise<void>((resolve, reject) => {
      reader
        .pipe(unzipper.Parse())
        .on('entry', async (entry: unzipper.Entry) => {
          const relativePath = entry.path;
          const relativePathWithoutRoot = this.stripRootDirectory(relativePath);

          if (!relativePathWithoutRoot) return entry.autodrain();

          const entryPath = this.getEntryPath(destinationPath, entry);

          if (entry.type === 'Directory') {
            this.createDirectory(entryPath);
            return entry.autodrain();
          }

          const entryDirname = path.dirname(entryPath);
          this.createDirectory(entryDirname);
          entry.pipe(this.createWriteStream(entryPath));
        })
        .on('close', () => {
          this.logger.debug(
            `extraction finished succesfully, sourcePath=${sourcePath} destinationPath=${destinationPath}`,
          );
        })
        .on('error', () => {
          this.logger.error(`extraction failed, sourcePath=${sourcePath}`);
          reject(new ExtractionError());
        });
    });
  }
}
