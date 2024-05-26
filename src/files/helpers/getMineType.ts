import { parse as parsePath } from 'path';

export function getMimeType(path: string): string {
  const extension = parsePath(path).ext.toLowerCase();
  switch (extension) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case 'bmp':
      return 'image/bmp';
    default:
      return 'application/octet-stream'; // Default to a safe type
  }
}
