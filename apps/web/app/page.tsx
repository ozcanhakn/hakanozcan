import Books from "@/components/home/Books";
import Cta from "@/components/home/Cta";
import Hero from "@/components/home/Hero";
import ProjectBlock from "@/components/home/ProjectBlock";
import Quote from "@/components/home/Quote";
import Tiles from "@/components/home/Tiles";
import Writing from "@/components/home/Writing";
import { getSiteSettings } from "@/lib/settings";
import { getWritingEntries } from "@/lib/writing";

export const revalidate = 60;

export default async function Page() {
  const settings = await getSiteSettings();
  const { blocks, order } = settings;
  const entries = blocks.writing.enabled ? await getWritingEntries(settings) : [];

  const renderers = {
    tiles: () => blocks.tiles.enabled && <Tiles block={blocks.tiles} />,
    books: () => blocks.books.enabled && <Books block={blocks.books} books={settings.books.items} />,
    writing: () => blocks.writing.enabled && <Writing block={blocks.writing} entries={entries} />,
    project: () => blocks.project.enabled && <ProjectBlock block={blocks.project} projects={settings.projects} />,
    quote: () => blocks.quote.enabled && <Quote block={blocks.quote} />,
    cta: () => blocks.cta.enabled && <Cta block={blocks.cta} />,
  };

  return (
    <div>
      <Hero hero={settings.hero} />
      {order.map((id) => (
        <div key={id}>{renderers[id]()}</div>
      ))}
    </div>
  );
}
