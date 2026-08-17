export class ExtractionError extends Error {
  constructor() {
    super('failed to extract archive');
    this.name = 'ExtractionError';
  }
}
