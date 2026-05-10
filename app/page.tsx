'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Disc, Lock, ShieldCheck, Music } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />

      <header className="z-10 text-center mb-12">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6"
        >
          <Disc className="w-4 h-4 animate-spin-slow text-orange-500" />
          <span className="text-xs font-bold tracking-widest uppercase text-orange-500">BOSS Of The Boyz Records</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl md:text-8xl font-black italic tracking-tighter mb-4"
        >
          COFRE DE BEATS
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-lg mx-auto text-lg"
        >
          Acesso exclusivo à biblioteca de produções premium da BOSS Of The Boyz.
          Organize, escute e componha no seu arsenal digital.
        </motion.p>
      </header>

      <main className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link href="/cofre" className="group">
          <motion.div 
            whileHover={{ y: -5 }}
            className="h-full p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 group-hover:border-orange-500/50 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
              <Lock className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Sala do Cofre</h2>
            <p className="text-gray-400">Explore os beats disponíveis, use o player profissional e escreva suas letras em tempo real.</p>
            <div className="mt-8 flex items-center gap-2 text-orange-500 font-bold group-hover:translate-x-2 transition-transform">
              <span>ACESSAR COFRE</span>
              <Music className="w-4 h-4" />
            </div>
          </motion.div>
        </Link>

        <Link href="/chefe" className="group">
          <motion.div 
            whileHover={{ y: -5 }}
            className="h-full p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 group-hover:border-red-500/50 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
              <ShieldCheck className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Sala do Chefe</h2>
            <p className="text-gray-400">Gerenciamento completo. Faça upload de novos beats, capas e organize sua gravadora.</p>
            <div className="mt-8 flex items-center gap-2 text-red-500 font-bold group-hover:translate-x-2 transition-transform">
              <span>PAINEL ADMIN</span>
              <Lock className="w-4 h-4" />
            </div>
          </motion.div>
        </Link>
      </main>

      <footer className="z-10 mt-20 text-gray-600 text-sm font-mono tracking-widest uppercase">
        © 2024 BOSS OF THE BOYZ RECORDS · PREMIUM BEAT STORAGE
      </footer>
    </div>
  )
}
