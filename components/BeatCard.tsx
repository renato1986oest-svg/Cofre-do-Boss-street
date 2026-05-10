'use client'

import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { Play, Pause, FileText, Music, Info, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'

interface Beat {
  id: number
  name: string
  genre: string
  bpm: number
  audio_url: string
  cover_url: string
}

export default function BeatCard({ beat }: { beat: Beat }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showNotepad, setShowNotepad] = useState(false)
  const [note, setNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#444',
      progressColor: '#f97316',
      cursorColor: '#f97316',
      barWidth: 2,
      barGap: 3,
      height: 60,
      normalize: true,
      url: beat.audio_url,
    })

    ws.on('play', () => setIsPlaying(true))
    ws.on('pause', () => setIsPlaying(false))
    ws.on('finish', () => setIsPlaying(false))

    wavesurferRef.current = ws

    // Fetch initial note
    fetch(`/api/notes?beatId=${beat.id}`)
      .then(res => res.json())
      .then(data => setNote(data.content))

    return () => ws.destroy()
  }, [beat.audio_url, beat.id])

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause()
    }
  }

  const saveNote = async () => {
    setIsSaving(true)
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beatId: beat.id, content: note })
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Cover & Info */}
        <div className="relative w-full md:w-64 h-64 flex-shrink-0 overflow-hidden">
          <Image
            src={beat.cover_url}
            alt={beat.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 mb-1">{beat.genre}</span>
            <h3 className="text-xl font-black italic tracking-tighter truncate">{beat.name}</h3>
          </div>
        </div>

        {/* Player & Actions */}
        <div className="flex-grow p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                  {isPlaying ? <Pause fill="white" className="w-5 h-5 text-white" /> : <Play fill="white" className="w-5 h-5 text-white ml-0.5" />}
                </button>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                    <Music className="w-3 h-3" />
                    <span>{beat.bpm} BPM</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowNotepad(!showNotepad)}
                  className={`p-2 rounded-lg transition-colors ${showNotepad ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                  title="Escrever letra"
                >
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div ref={containerRef} className="w-full mb-2" />
          </div>

          <AnimatePresence>
            {showNotepad && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Bloco de Notas / Letra</label>
                    <button 
                      onClick={saveNote}
                      disabled={isSaving}
                      className="text-[10px] flex items-center gap-1 font-bold uppercase text-orange-500 hover:text-orange-400 disabled:opacity-50"
                    >
                      {isSaving ? 'Salvando...' : <><Save className="w-3 h-3" /> Salvar</>}
                    </button>
                  </div>
                  <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Comece a escrever sua letra aqui..."
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:outline-none focus:border-orange-500/50 min-h-[120px] resize-none placeholder:text-gray-700"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
