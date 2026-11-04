import type { Metadata } from "next";

import BackgroundMedia from "@/components/BackgroundMedia";
import ContactView from "@/components/ContactView";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const { contact } = await getSiteSettings();
  const hasBackground = contact.media.length > 0;

  return (
    <section className="relative isolate overflow-hidden">
      {hasBackground && (
        <>
          <BackgroundMedia sources={contact.media} />
          <div className="absolute inset-0 -z-10 bg-black/45" />
        </>
      )}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
        {hasBackground ? (
          // The text sits on a light panel so it stays readable on top of any picture or video.
          <div className="rounded-2xl bg-white/92 backdrop-blur-md p-7 md:p-12 shadow-2xl">
            <ContactView />
          </div>
        ) : (
          <ContactView />
        )}
      </div>
    </section>
  );
}
