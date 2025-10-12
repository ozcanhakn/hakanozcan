"use client";

import Image from "next/image";

export default function Projects() {
  return (
    <section className="flex items-center justify-center bg-white text-[#1F1F1F] py-24 px-[10px]">
      <div className="flex flex-col md:flex-row gap-[10px] w-full">
        {/* Left Card */}
        <div className="flex-1 bg-[#F5F5F7] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-10 flex flex-col items-center text-center">
          <h2 className="text-4xl font-semibold mb-3 bg-gradient-to-r  from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Assistyl
          </h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            AI-Powered B2B Support Assistant
          </p>
            <button className="px-4 py-2 rounded-4xl transition-all duration-300 bg-blue-500 text-white">
                Projeyi Gör
            </button>
            <div className="w-full h-80 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
            {/* Görsel buraya eklenecek */}
            <Image
            src="/assistlydemo.png"
            alt="assistly"
            width={1024}
            height={512}/>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full border border-gray-300">
              React
            </span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full border border-gray-300">
              NodeJs
            </span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full border border-gray-300">
              Sentry
            </span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full border border-gray-300">
              Clerk
            </span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full border border-gray-300">
              Convex
            </span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full border border-gray-300">
              AWS
            </span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full border border-gray-300">
              Turbo
            </span>
          </div>
        </div>

        {/* Right Card */}
        <div className="flex-1 bg-[#F5F5F7] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-10 flex flex-col items-center text-center">
          <h2 className="text-4xl font-semibold mb-3 bg-gradient-to-r  from-gray-900 to-gray-600 bg-clip-text text-transparent">
            OrcaAI
          </h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            AI Orchestrator
          </p>
          <button className="px-4 py-2 rounded-4xl transition-all duration-300 bg-blue-500 text-white">
                Projeyi Gör
            </button>
          <div className="w-full h-80 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
            {/* Görsel buraya eklenecek */}
            <span className="text-gray-400">[ Proje Görseli ]</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full border border-gray-300">
                Go
            </span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full border border-gray-300">
                Docker
            </span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full border border-gray-300">
                Prometheus
            </span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full border border-gray-300">
                Grafana
            </span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full border border-gray-300">
                Redis
            </span>
          </div>
        </div>
      </div>

      
    </section>
  );
}
