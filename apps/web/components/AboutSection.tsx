"use client"

import Image from "next/image"

export default function AboutSection() {
  return (
    <section className="bg-white text-[#1F1F1F] py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-16">
        
        {/* Sol: Görsel */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-2xl"></div>
            <Image
              src="/myavatar.png"
              alt="Hakan Özcan"
              width={500}
              height={500}
              className="relative rounded-2xl object-cover shadow-2xl border-2 border-white"
            />
          </div>
        </div>

        {/* Sağ: İçerik */}
        <div className="flex-1 flex flex-col gap-8">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Merhaba,
            </h2>
            <p className="text-[#4A4A4A] text-lg md:text-xl leading-relaxed">
              Modern teknolojileri öğreniyor ve <span className="font-semibold text-gray-800">AI, Fullstack ve Veri Bilimi</span> alanlarında projeler geliştiriyorum.
            </p>
          </div>

          {/* Skills Grid - 2 Kart / Satır */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* AI & ML */}
            <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2">AI & ML</h3>
              <p className="text-sm text-gray-600">Python • TensorFlow • PyTorch • OpenAI API</p>
            </div>

            {/* Fullstack */}
            <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2">Fullstack</h3>
              <p className="text-sm text-gray-600">React • Next.js • Tailwind CSS • Node.js • Java • Go</p>
            </div>

            {/* DevOps & Cloud */}
            <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2">DevOps & Cloud</h3>
              <p className="text-sm text-gray-600">Docker • Kubernetes • Terraform • AWS</p>
            </div>

            {/* Data & Monitoring */}
            <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2">Data & Monitoring</h3>
              <p className="text-sm text-gray-600">Pandas • PostgreSQL • Grafana • Prometheus • Sentry • Firebase</p>
            </div>

            {/* Backend & Services */}
            <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2">Backend & Services</h3>
              <p className="text-sm text-gray-600">MySQL • Convex • Clerk • Redis • Kotlin</p>
            </div>

            {/* Tools & Deployment */}
            <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2">Tools & Deployment</h3>
              <p className="text-sm text-gray-600">Vite • Turbo • Supabase • Vercel</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
