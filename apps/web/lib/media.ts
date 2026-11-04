/** True when the address points to a video file (mp4 or webm); anything else is treated as a picture. */
export function isVideo(src: string): boolean {
  return /\.(mp4|webm)(?:[?#].*)?$/i.test(src.trim());
}
