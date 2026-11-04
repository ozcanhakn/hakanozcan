/**
 * Images chosen in the admin panel can live on any https host, which next/image would reject
 * unless every host were listed in next.config. A plain <img> works for all of them.
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
