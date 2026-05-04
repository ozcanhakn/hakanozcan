"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_API_URL}/rest/v1/contact_messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            created_at: new Date().toISOString()
          })
        }
      );

      if (!response.ok) {
        throw new Error('Mesaj gönderilemedi');
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
      alert('Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Github className="w-5 h-5" />,
      label: "GitHub",
      value: "ozcanhakn",
      url: "https://github.com/ozcanhakn"
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
      value: "Hakan Özcan",
      url: "https://www.linkedin.com/in/ozcanhakan/"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "ozcanhakn@gmail.com",
      url: "mailto:ozcanhakn@gmail.com"
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&display=swap');
        
        .contact-theme {
          --background: 201 100% 13%;
          --foreground: 0 0% 100%;
          --muted-foreground: 240 4% 66%;
        }
      `}</style>

      {/* Normal Page Section Overlay */}
      <section 
        className="relative w-full min-h-screen contact-theme bg-[hsl(var(--background))] text-white font-sans overflow-hidden" 
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full min-h-screen flex items-center justify-center py-32 px-6">
          <div className="max-w-6xl w-full mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 
                className="text-5xl md:text-7xl mb-4 text-white font-normal tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Let's Build Together
              </h1>
              <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto font-light">
                Projeleriniz için benimle iletişime geçin veya sadece merhaba deyin.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-2 space-y-6"
              >
                <h3 className="text-2xl font-medium text-white mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Contact Information
                </h3>

                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="liquid-glass flex items-center gap-5 p-5 rounded-2xl group transition-all duration-300 hover:bg-white/10"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white group-hover:scale-110 group-hover:bg-white transition-all duration-300 group-hover:text-black">
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">{info.label}</p>
                      <p className="text-base text-white font-medium group-hover:text-white transition-colors duration-300">
                        {info.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-3 liquid-glass rounded-3xl p-8 md:p-10"
              >
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                      <CheckIcon className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-3xl text-white mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      Message Sent!
                    </h3>
                    <p className="text-[hsl(var(--muted-foreground))] mb-8">
                      Teşekkür ederim. Mesajınızı aldım ve en kısa sürede size dönüş yapacağım.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300"
                    >
                      Yeni Mesaj Gönder
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">
                          Adınız
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-white/50 focus:ring-0 transition-all duration-300 outline-none placeholder:text-gray-600"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-white/50 focus:ring-0 transition-all duration-300 outline-none placeholder:text-gray-600"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">
                        Konu
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-white/50 focus:ring-0 transition-all duration-300 outline-none placeholder:text-gray-600"
                        placeholder="Proje Detayları"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">
                        Mesajınız
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-white/50 focus:ring-0 transition-all duration-300 outline-none resize-none placeholder:text-gray-600"
                        placeholder="Bana projenizden bahsedin..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-white text-black py-4 rounded-full font-medium hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Mesajı Gönder
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}