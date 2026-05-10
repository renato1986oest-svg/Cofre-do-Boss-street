'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import { Search, Filter, Lock, ArrowLeft, Disc } from 'lucide-react'
import Link from 'next/link'
import BeatCard from '@/components/BeatCard'

const GENRES = ['All', 'Trap', 'Drill', 'R&B', 'Boombap']

export default function CofrePage() {
  const [beats, setBeats] = useState([])
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/beats?search=${search}&genre=${genre}`)
        const data = await res.json()
        if (isMounted) setBeats(data)
      } finally {
        if (isMounted) setLoading(false)
      }
    }, 300)
    return () => { 
      isMounted = false
      clearTimeout(timer) 
    }
  }, [search, genre])

  return (
    <div className="min-h-screen pb-20">
      {/* Header Area */}
      <header className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              <h1 className="text-xl font-black italic tracking-tighter uppercase">SALA DO COFRE</h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1 text-xs font-mono text-gray-500">
               <Disc className="w-3 h-3 animate-spin-slow" />
               <span>ESTOQUE: {beats.length} BEATS</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome do beat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-2xl">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${genre === g ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {g === 'All' ? 'Todos' : g}
              </button>
            ))}
          </div>
        </div>

        {/* Beats Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
             <Disc className="w-12 h-12 text-orange-500/20 animate-spin" />
             <span className="text-gray-600 uppercase font-bold tracking-widest text-xs">Abrindo Cofre...</span>
          </div>
        ) : beats.length > 0 ? (
          <div className="flex flex-col gap-6">
            {beats.map((beat: any) => (
              <BeatCard key={beat.id} beat={beat} />
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-3xl py-32 text-center">
            <Filter className="w-12 h-12 text-gray-800 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-1">Cofre Vazio</h3>
            <p className="text-gray-600 text-sm">Nenhum beat encontrado com esses filtros.</p>
          </div>
        )}
      </main>
    </div>
  )
}
