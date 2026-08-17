export interface ExtractionService {
  extract(sourcePath: string, destinationPath: string): Promise<void>;
}
