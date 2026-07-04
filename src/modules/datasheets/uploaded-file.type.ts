/**
 * Minimal shape of a multer file (memoryStorage). Declared locally so we don't
 * depend on the global `Express.Multer.File` namespace augmentation, which isn't
 * present in this project's type setup.
 */
export interface UploadedMulterFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}
