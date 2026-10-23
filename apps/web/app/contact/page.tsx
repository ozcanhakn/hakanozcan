"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { siteConfig } from "@/content/site";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const emptyForm: ContactForm = { name: "", email: "", subject: "", message: "" };

const contactInfo = [
  { label: "Email", value: "ozcanhakn@gmail.com", url: siteConfig.socials.email },
  { label: "LinkedIn", value: "M. Hakan Özcan", url: siteConfig.socials.linkedin },
  { label: "GitHub", value: "ozcanhakn", url: siteConfig.socials.github },
];

const fieldClass =
  "w-full bg-transparent border-b border-ink/30 focus:border-navy py-3 font-display text-lg text-ink placeholder:text-stone/50 outline-none transition-colors";
const labelClass = "block text-xs tracking-[0.2em] uppercase text-stone mb-1";

export default function Contact() {
  const [formData, setFormData] = useState<ContactForm>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_API_URL}/rest/v1/contact_messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            created_at: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Message could not be sent");
      }

      setIsSubmitted(true);
      setFormData(emptyForm);
    } catch (error) {
      console.error("Message could not be sent:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5"
        >
          <p className="text-xs tracking-[0.25em] uppercase text-brass mb-6">Contact</p>
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[1] text-ink mb-8">
            Get in touch
          </h1>
          <p className="font-display text-xl leading-relaxed text-stone mb-12">
            About a project, a collaboration, or just to say hello.
          </p>

          <ul className="border-b border-line">
            {contactInfo.map((info) => (
              <li key={info.label} className="border-t border-line">
                <a
                  href={info.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-5"
                >
                  <span>
                    <span className="block text-xs tracking-[0.2em] uppercase text-stone mb-1">
                      {info.label}
                    </span>
                    <span className="font-display text-xl text-ink group-hover:text-navy transition-colors">
                      {info.value}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={20}
                    strokeWidth={1.25}
                    className="text-stone group-hover:text-navy transition-colors"
                  />
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="lg:col-span-7"
        >
          {isSubmitted ? (
            <div className="py-10">
              <h2 className="font-display text-4xl text-ink mb-4">Message sent.</h2>
              <p className="font-display text-xl text-stone mb-8 max-w-md">
                Thank you. I have received your message and will get back to you shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-sm tracking-wide text-ink border-b border-navy pb-1 hover:text-navy hover:border-navy transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label htmlFor="name" className={labelClass}>Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className={labelClass}>Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`${fieldClass} resize-none`}
                />
              </div>

              {hasError && (
                <p role="alert" className="text-sm text-red-800">
                  Something went wrong while sending your message. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="bg-navy text-cream px-8 py-4 text-sm tracking-wide hover:bg-navy-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
