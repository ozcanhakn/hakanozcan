import Link from "next/link";
import type { ReactNode } from "react";

/** Same-site paths use the Next router; everything else opens as a normal link. */
export default function SmartLink({
  href,
  className,
  children,
  onClick,
  ...rest
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  "aria-current"?: "page";
  "aria-haspopup"?: "true";
  "aria-expanded"?: boolean;
  onFocus?: () => void;
}) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={className} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:/i.test(href);
  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
