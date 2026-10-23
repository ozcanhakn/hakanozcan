import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ node, ...props }) => <h2 className="font-display text-4xl leading-[1.1] text-ink mt-14 mb-5" {...props} />,
  h2: ({ node, ...props }) => <h2 className="font-display text-4xl leading-[1.1] text-ink mt-14 mb-5" {...props} />,
  h3: ({ node, ...props }) => <h3 className="font-display text-3xl leading-[1.15] text-ink mt-10 mb-4" {...props} />,
  h4: ({ node, ...props }) => <h4 className="font-display text-2xl leading-[1.2] text-ink mt-8 mb-3" {...props} />,
  p: ({ node, ...props }) => <p className="text-[18px] leading-[1.8] text-ink/90 mb-6" {...props} />,
  a: ({ node, href, ...props }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="text-navy underline underline-offset-[5px] decoration-navy/30 hover:decoration-navy transition-colors"
      {...props}
    />
  ),
  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-[18px] leading-[1.75] text-ink/90" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-[18px] leading-[1.75] text-ink/90" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="font-display italic text-2xl leading-[1.35] text-ink border-l-2 border-brass pl-6 my-8" {...props} />
  ),
  hr: () => <hr className="my-12 border-line" />,
  img: ({ node, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt ?? ""} loading="lazy" className="w-full my-8 border border-line" {...props} />
  ),
  pre: ({ node, ...props }) => (
    <pre className="my-8 overflow-x-auto bg-navy text-cream p-5 text-sm leading-relaxed font-mono" {...props} />
  ),
  code: ({ node, className, ...props }) => (
    <code className={className ?? "bg-cream-deep px-1.5 py-0.5 text-[0.9em] font-mono"} {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full text-left text-[15px] border-collapse" {...props} />
    </div>
  ),
  th: ({ node, ...props }) => <th className="border-b border-ink py-2 pr-4 font-medium" {...props} />,
  td: ({ node, ...props }) => <td className="border-b border-line py-2 pr-4" {...props} />,
};

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
