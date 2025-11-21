"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { useState } from "react";

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
      icon: <Github className="w-6 h-6" />,
      label: "GitHub",
      value: "ozcanhakn",
      url: "https://github.com/ozcanhakn"
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      label: "LinkedIn",
      value: "Hakan Özcan",
      url: "https://www.linkedin.com/in/ozcanhakan/"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      value: "ozcanhakn@gmail.com",
      url: "mailto:ozcanhakn@gmail.com"
    }
  ];

  return (
    <section className="min-h-screen w-full bg-black text-white py-32 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10 tracking-tighter">
            İLETİŞİM
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Projeleriniz için benimle iletişime geçin veya sadece merhaba deyin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <h3 className="text-3xl font-bold text-white mb-8">
              Bilgilerim
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
                className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 text-white rounded-xl group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                  {info.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400 font-medium mb-1">{info.label}</p>
                  <p className="text-lg text-white font-semibold group-hover:text-blue-200 transition-colors duration-300">
                    {info.value}
                  </p>
                </div>
                <ArrowIcon className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </motion.a>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-md relative overflow-hidden"
          >
            {/* Form Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                  <CheckIcon className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Mesajınız Gönderildi!
                </h3>
                <p className="text-gray-400 mb-8">
                  Teşekkür ederim. Mesajınızı aldım ve en kısa sürede size dönüş yapacağım.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors duration-300"
                >
                  Yeni Mesaj Gönder
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                      Adınız *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300 outline-none placeholder:text-gray-600"
                      placeholder="Adınızı yazın"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300 outline-none placeholder:text-gray-600"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
                    Konu *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300 outline-none placeholder:text-gray-600"
                    placeholder="Mesaj konusu"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300 outline-none resize-none placeholder:text-gray-600"
                    placeholder="Mesajınızı detaylı bir şekilde yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Mesajı Gönder
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}