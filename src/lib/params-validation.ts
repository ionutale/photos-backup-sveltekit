export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getFormatFromExtension(extension: string) {
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "jpeg";
    case "png":
      return "png";
    case "webp":
      return "webp";
    case "avif":
      return "avif";
    default:
      return "jpeg";
  }
}

