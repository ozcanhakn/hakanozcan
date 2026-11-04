import SiteVideo from "@/components/SiteVideo";
import { isVideo } from "@/lib/media";

/**
 * Images chosen in the admin panel can live on any https host, which next/image would reject
 * unless every host were listed in next.config. A plain <img> works for all of them.
 * An address ending in .mp4 or .webm is shown as a silent looping clip instead.
 */
export default function SiteImage({
  src,
  alt = "",
  className,
  priority = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  if (isVideo(src)) return <SiteVideo src={src} className={className} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
