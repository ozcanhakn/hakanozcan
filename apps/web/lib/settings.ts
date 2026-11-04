import { siteConfig } from "@/content/site";
import { projects as defaultProjects } from "@/content/projects";

export type BlockId = "tiles" | "books" | "writing" | "project" | "quote" | "cta";
export const BLOCK_IDS: BlockId[] = ["tiles", "books", "writing", "project", "quote", "cta"];

export interface Book {
  id: string;
  title: string;
  author: string;
  /** Short label above the title, like “PERMIT PENDING” on Gates Notes. */
  kicker: string;
  category: string;
  /** One or two sentences shown on cards. */
  summary: string;
  /** Cover or photo. */
  image: string;
  /** Full review in Markdown. When present, the card opens an on-site review page. */
  review: string;
  /** Where to read or buy the book, used when there is no on-site review. */
  href: string;
  /** Shown first on the home page and at the top of the Books page. */
  featured: boolean;
}

/** A written recommendation, like a reading list. Its body can embed books with {{book:id}} on its own line. */
export interface Recommendation {
  id: string;
  title: string;
  summary: string;
  image: string;
  /** Markdown, with `{{book:book-id}}` lines that become book cards. */
  body: string;
  published: boolean;
  /** ISO date, shown on the page and used to order the list (newest first). */
  date: string;
}

/** Categories are typed as one comma separated line: "Psychology, Philosophy". */
export function bookTags(category: string): string[] {
  const seen = new Set<string>();
  return category
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => {
      const key = tag.toLowerCase();
      if (!tag || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Tile {
  title: string;
  body: string;
  image: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  type: string;
  status: string;
  summary: string;
  image: string;
  tags: string[];
  href: string;
  featured: boolean;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface SiteSettings {
  brand: { name: string; accent: string };
  nav: { links: NavLink[]; ctaLabel: string; ctaHref: string };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    image: string;
    /** Further backgrounds (pictures or videos) shown one after another after `image`. */
    moreMedia: string[];
    ctaLabel: string;
    ctaHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  /** Order of the blocks under the hero on the home page. */
  order: BlockId[];
  blocks: {
    tiles: { enabled: boolean; eyebrow: string; title: string; intro: string; items: Tile[] };
    books: { enabled: boolean; eyebrow: string; title: string; count: number; linkLabel: string };
    writing: { enabled: boolean; eyebrow: string; title: string; count: number; linkLabel: string };
    project: { enabled: boolean; eyebrow: string; title: string };
    quote: { enabled: boolean; text: string; author: string };
    cta: { enabled: boolean; eyebrow: string; heading: string; body: string; buttonLabel: string; buttonHref: string };
  };
  projects: Project[];
  books: { page: { title: string; intro: string }; items: Book[]; recommendations: Recommendation[] };
  footer: { columns: FooterColumn[]; note: string; email: string };
  /** Contact page: pictures or videos shown behind the form (one after another when there are several). */
  contact: { media: string[] };
  hiddenMedium: string[];
}

export const SETTINGS_KEY = "site";
export const DEFAULT_ACCENT = "#0b6e99";

export const defaultSettings: SiteSettings = {
  brand: { name: siteConfig.name, accent: DEFAULT_ACCENT },
  nav: {
    links: [
      { label: "Work", href: "/projects" },
      { label: "About", href: "/#about" },
      { label: "Books", href: "/books" },
      { label: "Writing", href: "/blog" },
    ],
    ctaLabel: "Contact",
    ctaHref: "/contact",
  },
  hero: {
    eyebrow: "Intelligence Systems",
    headline: siteConfig.tagline,
    subheadline: siteConfig.intro,
    image: "",
    moreMedia: [],
    ctaLabel: "View my work",
    ctaHref: "/projects",
    secondaryLabel: "Read my writing",
    secondaryHref: "/blog",
  },
  order: [...BLOCK_IDS],
  blocks: {
    tiles: {
      enabled: true,
      eyebrow: "Explore",
      title: "What I work on",
      intro: siteConfig.approach,
      items: siteConfig.focusAreas.map((area) => ({ ...area, image: "", href: "/projects" })),
    },
    books: { enabled: true, eyebrow: "Books", title: "The books on my bookshelf", count: 3, linkLabel: "Explore books" },
    writing: { enabled: true, eyebrow: "Writing", title: "Latest from my notes", count: 3, linkLabel: "All writing" },
    project: { enabled: true, eyebrow: "Work", title: "Selected work" },
    quote: {
      enabled: true,
      text: [siteConfig.statement, siteConfig.statementBody].filter(Boolean).join(" "),
      author: siteConfig.name,
    },
    cta: {
      enabled: true,
      eyebrow: "Contact",
      heading: "Let's work on something that matters.",
      body: "About a project, a collaboration, or just to say hello.",
      buttonLabel: "Get in touch",
      buttonHref: "/contact",
    },
  },
  projects: defaultProjects.map((project) => ({
    id: project.id,
    title: project.title,
    type: project.type ?? "",
    status: project.status ?? "",
    summary: project.summary,
    image: project.image ?? "",
    tags: [...project.tags],
    href: project.href ?? "",
    featured: Boolean(project.featured),
  })),
  // Sample entries so the Books section is visible on a fresh install. Replace them in the admin panel.
  books: {
    page: {
      title: "The books on my bookshelf",
      intro: "Books on forecasting, data and building systems that hold up in the real world.",
    },
    items: [
      {
        id: "superforecasting",
        title: "Superforecasting",
        author: "Philip Tetlock & Dan Gardner",
        kicker: "Reading list",
        category: "Forecasting",
        summary: "Why some people are consistently better at predicting events, and what the rest of us can learn from them.",
        image: "",
        review: "",
        href: "",
        featured: true,
      },
      {
        id: "the-signal-and-the-noise",
        title: "The Signal and the Noise",
        author: "Nate Silver",
        kicker: "Reading list",
        category: "Forecasting",
        summary: "A look at why most predictions fail, and how to separate real signals from noise.",
        image: "",
        review: "",
        href: "",
        featured: false,
      },
      {
        id: "designing-data-intensive-applications",
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        kicker: "Reading list",
        category: "Engineering",
        summary: "The ideas behind reliable, scalable and maintainable data systems.",
        image: "",
        review: "",
        href: "",
        featured: false,
      },
    ],
    recommendations: [],
  },
  footer: {
    columns: [
      {
        title: "Explore",
        links: [
          { label: "Work", href: "/projects" },
          { label: "About", href: "/#about" },
          { label: "Books", href: "/books" },
          { label: "Writing", href: "/blog" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Elsewhere",
        links: [
          { label: "LinkedIn", href: siteConfig.socials.linkedin },
          { label: "GitHub", href: siteConfig.socials.github },
          { label: "X", href: siteConfig.socials.twitter },
          { label: "Medium", href: siteConfig.socials.medium },
        ],
      },
    ],
    note: `© ${siteConfig.name}. All rights reserved.`,
    email: "ozcanhakn@gmail.com",
  },
  contact: { media: [] },
  hiddenMedium: [],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Required text: falls back when missing or blank. */
const str = (value: unknown, fallback: string, max: number) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;

/** Optional text: an empty string is a valid answer. */
const opt = (value: unknown, fallback: string, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : fallback;

const flag = (value: unknown, fallback: boolean) => (typeof value === "boolean" ? value : fallback);

const LINK_PATTERN = /^(\/(?!\/)\S*|#\S*|https?:\/\/\S+|mailto:\S+)$/i;
const IMAGE_PATTERN = /^(\/(?!\/)\S*|https:\/\/\S+)$/i;

/** Only same-site paths, http(s) links and mailto: are accepted, so a saved value can never be a script URL. */
const link = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim().slice(0, 500);
  return trimmed === "" || LINK_PATTERN.test(trimmed) ? trimmed : fallback;
};

const image = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim().slice(0, 1000);
  return trimmed === "" || IMAGE_PATTERN.test(trimmed) ? trimmed : fallback;
};

/** Uses the stored array when there is one (even an empty one); otherwise the defaults. */
function list<T>(value: unknown, fallback: T[], max: number, map: (item: Record<string, unknown>) => T | null): T[] {
  if (!Array.isArray(value)) return fallback;
  return value.flatMap((item) => (isRecord(item) ? [map(item)] : [])).filter((item): item is T => item !== null).slice(0, max);
}

const navLink = (item: Record<string, unknown>): NavLink | null => {
  const label = opt(item.label, "", 60);
  const href = link(item.href, "");
  return label && href ? { label, href } : null;
};

const slugId = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "project";

/** Merges whatever is stored with the defaults, so a missing or partial row never breaks the site. */
export function mergeSettings(stored: unknown): SiteSettings {
  const d = defaultSettings;
  if (!isRecord(stored)) return d;

  const brand = isRecord(stored.brand) ? stored.brand : {};
  const nav = isRecord(stored.nav) ? stored.nav : {};
  const hero = isRecord(stored.hero) ? stored.hero : {};
  const blocks = isRecord(stored.blocks) ? stored.blocks : {};
  const footer = isRecord(stored.footer) ? stored.footer : {};
  const contact = isRecord(stored.contact) ? stored.contact : {};
  const b = (key: BlockId) => (isRecord(blocks[key]) ? (blocks[key] as Record<string, unknown>) : {});

  // Settings saved before the redesign kept their texts in `content`: carry the edits over.
  const legacy = isRecord(stored.content) ? stored.content : {};
  const legacySections = isRecord(stored.sections) ? stored.sections : {};
  const legacyAreas = list(legacy.focusAreas, [], 6, (area) => {
    const title = opt(area.title, "", 80);
    return title ? { title, body: opt(area.body, "", 400), image: "", href: "/projects" } : null;
  });
  const legacyQuote = [legacy.statement, legacy.statementBody]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .join(" ");

  const tiles = b("tiles");
  const books = b("books");
  const booksPage = isRecord(stored.books) && isRecord(stored.books.page) ? stored.books.page : {};
  const writing = b("writing");
  const project = b("project");
  const quote = b("quote");
  const cta = b("cta");

  const order = Array.isArray(stored.order)
    ? stored.order.filter((id, index, all): id is BlockId => BLOCK_IDS.includes(id as BlockId) && all.indexOf(id) === index)
    : [];
  for (const id of BLOCK_IDS) if (!order.includes(id)) order.push(id);

  const count = typeof writing.count === "number" ? Math.min(6, Math.max(1, Math.round(writing.count))) : d.blocks.writing.count;

  return {
    brand: {
      name: str(brand.name, d.brand.name, 60),
      accent: typeof brand.accent === "string" && /^#[0-9a-f]{6}$/i.test(brand.accent) ? brand.accent : d.brand.accent,
    },
    nav: {
      links: list(nav.links, d.nav.links, 8, navLink),
      ctaLabel: opt(nav.ctaLabel, d.nav.ctaLabel, 40),
      ctaHref: link(nav.ctaHref, d.nav.ctaHref),
    },
    hero: {
      eyebrow: opt(hero.eyebrow, d.hero.eyebrow, 60),
      headline: str(hero.headline, d.hero.headline, 200),
      subheadline: opt(hero.subheadline, typeof legacy.intro === "string" ? legacy.intro : d.hero.subheadline, 600),
      image: image(hero.image, d.hero.image),
      moreMedia: Array.isArray(hero.moreMedia)
        ? hero.moreMedia.map((item) => image(item, "")).filter(Boolean).slice(0, 9)
        : d.hero.moreMedia,
      ctaLabel: opt(hero.ctaLabel, d.hero.ctaLabel, 40),
      ctaHref: link(hero.ctaHref, d.hero.ctaHref),
      secondaryLabel: opt(hero.secondaryLabel, d.hero.secondaryLabel, 40),
      secondaryHref: link(hero.secondaryHref, d.hero.secondaryHref),
    },
    order,
    blocks: {
      tiles: {
        enabled: flag(tiles.enabled, legacySections.expertise !== false),
        eyebrow: opt(tiles.eyebrow, d.blocks.tiles.eyebrow, 60),
        title: str(tiles.title, d.blocks.tiles.title, 120),
        intro: opt(tiles.intro, typeof legacy.approach === "string" ? legacy.approach : d.blocks.tiles.intro, 600),
        items: list(tiles.items, legacyAreas.length > 0 ? legacyAreas : d.blocks.tiles.items, 8, (item) => {
          const title = opt(item.title, "", 80);
          return title ? { title, body: opt(item.body, "", 400), image: image(item.image, ""), href: link(item.href, "") } : null;
        }),
      },
      books: {
        enabled: flag(books.enabled, d.blocks.books.enabled),
        eyebrow: opt(books.eyebrow, d.blocks.books.eyebrow, 60),
        title: str(books.title, d.blocks.books.title, 120),
        count: typeof books.count === "number" ? Math.min(6, Math.max(1, Math.round(books.count))) : d.blocks.books.count,
        linkLabel: opt(books.linkLabel, d.blocks.books.linkLabel, 40),
      },
      writing: {
        enabled: flag(writing.enabled, d.blocks.writing.enabled),
        eyebrow: opt(writing.eyebrow, d.blocks.writing.eyebrow, 60),
        title: str(writing.title, d.blocks.writing.title, 120),
        count,
        linkLabel: opt(writing.linkLabel, d.blocks.writing.linkLabel, 40),
      },
      project: {
        enabled: flag(project.enabled, legacySections.work !== false),
        eyebrow: opt(project.eyebrow, d.blocks.project.eyebrow, 60),
        title: str(project.title, d.blocks.project.title, 120),
      },
      quote: {
        enabled: flag(quote.enabled, legacySections.statement !== false),
        text: str(quote.text, legacyQuote || d.blocks.quote.text, 400),
        author: opt(quote.author, d.blocks.quote.author, 80),
      },
      cta: {
        enabled: flag(cta.enabled, d.blocks.cta.enabled),
        eyebrow: opt(cta.eyebrow, d.blocks.cta.eyebrow, 60),
        heading: str(cta.heading, d.blocks.cta.heading, 160),
        body: opt(cta.body, d.blocks.cta.body, 400),
        buttonLabel: opt(cta.buttonLabel, d.blocks.cta.buttonLabel, 40),
        buttonHref: link(cta.buttonHref, d.blocks.cta.buttonHref),
      },
    },
    projects: list(stored.projects, d.projects, 30, (item) => {
      const title = opt(item.title, "", 120);
      if (!title) return null;
      return {
        id: opt(item.id, "", 60) || slugId(title),
        title,
        type: opt(item.type, "", 80),
        status: opt(item.status, "", 40),
        summary: opt(item.summary, "", 600),
        image: image(item.image, ""),
        tags: Array.isArray(item.tags)
          ? item.tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0).map((tag) => tag.trim().slice(0, 40)).slice(0, 8)
          : [],
        href: link(item.href, ""),
        featured: item.featured === true,
      };
    }),
    books: {
      page: {
        title: str(booksPage.title, d.books.page.title, 120),
        intro: opt(booksPage.intro, d.books.page.intro, 400),
      },
      items: list(isRecord(stored.books) ? stored.books.items : undefined, d.books.items, 200, (item) => {
        const title = opt(item.title, "", 160);
        if (!title) return null;
        return {
          id: opt(item.id, "", 60) || slugId(title),
          title,
          author: opt(item.author, "", 120),
          kicker: opt(item.kicker, "", 60),
          // Several categories fit on one line ("Psychology, Philosophy, Mythology"), so this is generous.
          category: opt(item.category, "", 200),
          summary: opt(item.summary, "", 400),
          image: image(item.image, ""),
          review: typeof item.review === "string" ? item.review.slice(0, 50_000) : "",
          href: link(item.href, ""),
          featured: item.featured === true,
        };
      }),
      recommendations: list(isRecord(stored.books) ? stored.books.recommendations : undefined, d.books.recommendations, 100, (item) => {
        const title = opt(item.title, "", 160);
        if (!title) return null;
        const date = typeof item.date === "string" && !Number.isNaN(Date.parse(item.date)) ? item.date : new Date().toISOString();
        return {
          id: opt(item.id, "", 60) || slugId(title),
          title,
          summary: opt(item.summary, "", 400),
          image: image(item.image, ""),
          body: typeof item.body === "string" ? item.body.slice(0, 60_000) : "",
          published: item.published !== false,
          date,
        };
      }),
    },
    footer: {
      columns: list(footer.columns, d.footer.columns, 4, (column) => {
        const title = opt(column.title, "", 40);
        return title ? { title, links: list(column.links, [], 10, navLink) } : null;
      }),
      note: opt(footer.note, d.footer.note, 200),
      email: opt(footer.email, d.footer.email, 120),
    },
    contact: {
      media: Array.isArray(contact.media)
        ? contact.media.map((item) => image(item, "")).filter(Boolean).slice(0, 10)
        : d.contact.media,
    },
    hiddenMedium: Array.isArray(stored.hiddenMedium)
      ? stored.hiddenMedium.filter((item): item is string => typeof item === "string")
      : [],
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return defaultSettings;

  try {
    const res = await fetch(
      `${url}/rest/v1/site_settings?key=eq.${SETTINGS_KEY}&select=value&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 60 } }
    );
    if (!res.ok) return defaultSettings;
    const rows: unknown = await res.json();
    const value = Array.isArray(rows) && isRecord(rows[0]) ? rows[0].value : null;
    return mergeSettings(value);
  } catch (error) {
    console.error("Could not load site settings:", error);
    return defaultSettings;
  }
}
