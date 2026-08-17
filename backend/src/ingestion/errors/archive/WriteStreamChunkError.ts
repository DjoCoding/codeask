export class WriteStreamChunkError extends Error {
  constructor() {
    super('failed to write stream chunk');
    this.name = 'WriteStreamChunkError';
  }
}
