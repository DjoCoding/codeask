import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import path from 'path';

@Injectable()
export class StorageService {
  private readonly BASE_TEMP_STORAGE_DIR = '.tmp/codeask';
  private readonly INGESTIONS_DIR = 'ingestions';
  private readonly ARCHIVE_DIR = 'archive';
  private readonly SOURCE_DIR = 'source';

  private readonly logger = new Logger(StorageService.name);

  constructor() {}

  private getIngestionWorkspacePath(ingestionId: string) {
    const parts = [
      this.BASE_TEMP_STORAGE_DIR,
      this.INGESTIONS_DIR,
      ingestionId,
    ];
    return parts.join(path.sep);
  }

  getIngestionArchiveDirectoryPath(workspacePath: string) {
    const parts = [workspacePath, this.ARCHIVE_DIR];
    return parts.join(path.sep);
  }

  getIngestionSourceDirectoryPath(workspacePath: string) {
    const parts = [workspacePath, this.SOURCE_DIR];
    return parts.join(path.sep);
  }

  private getIngestionWorkspacePaths(ingestionId: string) {
    const workspacePath = this.getIngestionWorkspacePath(ingestionId);
    const archivePath = this.getIngestionArchiveDirectoryPath(workspacePath);
    const sourcePath = this.getIngestionSourceDirectoryPath(workspacePath);

    return {
      workspacePath,
      archivePath,
      sourcePath,
    };
  }

  private async createDirectory(path: string) {
    return fs.mkdir(path, {
      recursive: true,
    });
  }

  private async removeDirectory(path: string) {
    return fs.rmdir(path, {
      recursive: true,
    });
  }

  async createIngestionWorkspace(ingestionId: string) {
    const { workspacePath, archivePath, sourcePath } =
      this.getIngestionWorkspacePaths(ingestionId);

    await this.createDirectory(workspacePath);
    this.logger.debug(
      `ingestion workspace created, workspacePath=${workspacePath}`,
    );

    await this.createDirectory(archivePath);
    this.logger.debug(
      `ingestion workspace archive directory created, workspacePath=${workspacePath} archivePath=${archivePath}`,
    );

    await this.createDirectory(sourcePath);
    this.logger.debug(
      `ingestion workspace source directory created, workspacePath=${workspacePath} sourcePath=${sourcePath}`,
    );

    return workspacePath;
  }

  async cleanUpIngestionWorkspace(ingestionId: string) {
    const workspacePath = this.getIngestionWorkspacePath(ingestionId);
    return this.removeDirectory(workspacePath);
  }
}
