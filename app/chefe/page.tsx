'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Disc, Lock, ShieldCheck, Upload, Trash2, ArrowLeft, Image as ImageIcon, Music, Check, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const GENRES = ['Trap', 'Drill', 'R&B', 'Boombap']

export default function ChefePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [beats, setBeats] = useState([])
  const [uploading, setUploading] = useState(false)
  
  // Form State
  const [name, setName] = useState('')
  const [genre, setGenre] = useState('Trap')
  const [bpm, setBpm] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const fetchBeats = useCallback(async () => {
    try {
      const res = await fetch('/api/beats')
      const data = await res.json()
      setBeats(data)
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        void fetchBeats()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, fetchBeats])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple static password for demo - in prod use env
    if (password === 'boss123') {
      setIsAuthenticated(true)
    } else {
      alert('Acesso negado. Senha incorreta.')
    }
  }

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setAudioPreviewUrl(URL.createObjectURL(file))
      
      // Auto-detect BPM (Simplified logic or placeholder)
      // Real BPM detection would use Web Audio API analysis
      // For now, let's pretend to calculate or wait for audio analysis
      detectBpm(file)
    }
  }

  const detectBpm = (file: File) => {
      // In a real app we'd use a library like 'bpm-detective'
      // Placeholder: setting a random BPM between 80-160 for demo
      const randomBpm = Math.floor(Math.random() * (160 - 80 + 1)) + 80
      setBpm(randomBpm.toString())
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      setCoverPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!audioFile || !coverFile || !name) return

    setUploading(true)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('genre', genre)
    formData.append('bpm', bpm)
    formData.append('audio', audioFile)
    formData.append('cover', coverFile)

    try {
      const res = await fetch('/api/beats/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        // Reset form
        setName('')
        setBpm('')
        setAudioFile(null)
        setCoverFile(null)
        setAudioPreviewUrl(null)
        setCoverPreviewUrl(null)
        fetchBeats()
        alert('Beat publicado com sucesso no Cofre!')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const deleteBeat = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este beat permanentemente do Cofre?')) return
    
    try {
      const res = await fetch('/api/beats', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        fetchBeats()
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-10 rounded-3xl bg-white/[0.03] border border-white/10 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Sala do Chefe</h1>
          <p className="text-gray-500 text-sm mb-8">Área restrita. Digite a senha de acesso.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Senha de Acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-center focus:outline-none focus:border-red-500 transition-all"
              autoFocus
            />
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-600/20 uppercase tracking-widest text-xs">
              ENTRAR NO PAINEL
            </button>
          </form>
          
          <Link href="/" className="inline-block mt-8 text-gray-600 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            Voltar para o site
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-500" />
              <h1 className="text-xl font-black italic tracking-tighter uppercase">SALA DO CHEFE</h1>
            </div>
          </div>
          
          <button onClick={() => setIsAuthenticated(false)} className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white">
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-red-500 mb-6 flex items-center gap-2">
              <Upload className="w-4 h-4" /> NOVO LANÇAMENTO
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Título do Beat</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Ghost Mode"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Gênero</label>
                  <select 
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 transition-all appearance-none"
                  >
                    {GENRES.map(g => <option key={g} value={g} className="bg-black">{g}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">BPM (Auto)</label>
                  <input 
                    type="number" 
                    value={bpm}
                    onChange={(e) => setBpm(e.target.value)}
                    placeholder="Auto"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Audio Upload Area */}
                <div className="relative">
                  <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={handleAudioChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${audioFile ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-red-500/30 bg-white/[0.02]'}`}>
                    {audioFile ? (
                      <div className="flex items-center justify-center gap-2 text-green-500 text-sm font-bold truncate">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{audioFile.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Music className="w-6 h-6 text-gray-600 mx-auto" />
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Arquivo de Áudio</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Upload Area */}
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleCoverChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-2xl overflow-hidden transition-all ${coverFile ? 'border-green-500/50' : 'border-white/10 hover:border-red-500/30'}`}>
                    {coverPreviewUrl ? (
                      <div className="relative h-32 w-full">
                        <Image src={coverPreviewUrl} alt="Preview" fill className="object-cover opacity-60" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                           <Check className="w-6 h-6 text-green-500" />
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center bg-white/[0.02]">
                        <ImageIcon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Capa do Beat</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={uploading || !audioFile || !coverFile || !name}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-red-600/20 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Disc className="w-4 h-4 animate-spin" />
                    PUBLICANDO...
                  </>
                ) : 'SALVAR NO COFRE'}
              </button>
            </form>
          </div>

          {/* List/Inventory Area */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-2">
               ESTOQUE ATUAL
            </h2>

            <div className="space-y-3">
              {beats.length === 0 ? (
                <div className="py-20 text-center opacity-20 border border-dashed border-white/10 rounded-3xl">
                  <Disc className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-xs uppercase tracking-widest font-bold">Nenhum beat em estoque</p>
                </div>
              ) : (
                beats.map((beat: any) => (
                  <div key={beat.id} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                         <Image src={beat.cover_url} alt={beat.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm uppercase italic tracking-tighter truncate max-w-[200px]">{beat.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                          <span className="text-red-500">{beat.genre}</span>
                          <span>{beat.bpm} BPM</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Delete Icon */}
                    <div className="hidden group-hover:flex items-center gap-2">
                      <button 
                        onClick={() => deleteBeat(beat.id)}
                        className="p-2 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 rounded-lg transition-all" 
                        title="Excluir beat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
