"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileTextIcon, Copy, CheckCircle, Clock, BookOpen, Hash, Type, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { buildToolJsonLd } from "@/lib/seo"

interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  readingTime: number
  speakingTime: number
}

export default function ContentCounterPage() {
  const [content, setContent] = useState("")
  const [copied, setCopied] = useState(false)

  const stats = useMemo((): TextStats => {
    if (!content.trim()) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0,
      }
    }

    const characters = content.length
    const charactersNoSpaces = content.replace(/\s/g, "").length
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    const sentences = content.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0).length
    const paragraphs = content.split(/\n\s*\n/).filter((paragraph) => paragraph.trim().length > 0).length

    // Average reading speed: 200-250 words per minute
    const readingTime = Math.ceil(words / 225)
    // Average speaking speed: 150-160 words per minute
    const speakingTime = Math.ceil(words / 155)

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    }
  }, [content])

  const handleCopy = async () => {
    if (!content) return

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy content:", error)
    }
  }

  const handleClear = () => {
    setContent("")
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setContent(text)
    } catch (error) {
      console.error("Failed to paste from clipboard:", error)
    }
  }

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat.",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildToolJsonLd("content-counter")) }}
      />
      {/* <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              ToolkitSol
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/image-converter" className="text-slate-600 hover:text-blue-600 transition-colors">
                Image Converter
              </Link>
              <Link href="/qr-generator" className="text-slate-600 hover:text-blue-600 transition-colors">
                QR Generator
              </Link>
              <Link href="/background-remover" className="text-slate-600 hover:text-blue-600 transition-colors">
                Background Remover
              </Link>
            </nav>
          </div>
        </div>
      </header> */}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Advanced Text Analysis
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance"
          >
            Content Counter
            <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              {" "}
              & Analyzer
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty"
          >
            Analyze your text with comprehensive statistics including word count, character count, reading time, and
            detailed insights.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <FileTextIcon className="w-4 h-4 text-white" />
                    </div>
                    Enter Your Content
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Type, paste, or upload your text content for comprehensive analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="content" className="text-base font-medium text-slate-800">
                      Text Content
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Start typing or paste your content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={12}
                      className="resize-none font-mono text-sm border-2 border-slate-200 focus:border-green-500 bg-white/90 backdrop-blur-sm rounded-xl"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePasteFromClipboard}
                      size="sm"
                      className="bg-white/60 backdrop-blur-sm border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200 rounded-xl"
                    >
                      Paste from Clipboard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCopy}
                      disabled={!content}
                      size="sm"
                      className="bg-white/60 backdrop-blur-sm border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200 rounded-xl"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Text
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClear}
                      disabled={!content}
                      size="sm"
                      className="bg-white/60 backdrop-blur-sm border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 rounded-xl"
                    >
                      Clear
                    </Button>
                  </div>

                  {/* <div className="space-y-3">
                    <Label className="text-base font-medium text-slate-800">Try Sample Texts</Label>
                    <div className="space-y-2">
                      {sampleTexts.map((sample, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setContent(sample)}
                          className="w-full justify-start text-left h-auto p-4 bg-white/60 backdrop-blur-sm border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200 rounded-xl"
                        >
                          <span className="text-xs text-slate-600 line-clamp-2">
                            {sample.length > 100 ? `${sample.substring(0, 100)}...` : sample}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div> */}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-gradient-to-br from-green-50/50 to-teal-50/50 backdrop-blur-sm border border-green-200/50 shadow-xl rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-green-800">AI Content Rewriting</h3>
                      <p className="text-sm text-green-700">
                        Coming soon: AI-powered content improvement and rewriting features
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Hash className="w-4 h-4 text-white" />
                    </div>
                    Text Statistics
                  </CardTitle>
                  <CardDescription className="text-slate-600">Real-time analysis of your content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-xl border border-blue-200/50">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {stats.characters.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">Characters</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-200/50">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {stats.words.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">Words</div>
                    </div>
                  </div>

                  <Separator className="bg-slate-200" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl">
                      <span className="text-sm text-slate-700 font-medium">Characters (no spaces)</span>
                      <Badge className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                        {stats.charactersNoSpaces.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl">
                      <span className="text-sm text-slate-700 font-medium">Sentences</span>
                      <Badge className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                        {stats.sentences.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl">
                      <span className="text-sm text-slate-700 font-medium">Paragraphs</span>
                      <Badge className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                        {stats.paragraphs.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    Time Estimates
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Based on average reading and speaking speeds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-xl border border-orange-200/50">
                      <span className="text-sm text-slate-700 font-medium">Reading time</span>
                      <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                        {stats.readingTime === 0 ? "0 min" : `${stats.readingTime} min`}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-xl border border-orange-200/50">
                      <span className="text-sm text-slate-700 font-medium">Speaking time</span>
                      <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                        {stats.speakingTime === 0 ? "0 min" : `${stats.speakingTime} min`}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 p-3 bg-slate-50/50 rounded-xl">
                    <p>• Reading: ~225 words/min</p>
                    <p>• Speaking: ~155 words/min</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Type className="w-4 h-4 text-white" />
                    </div>
                    Text Density
                  </CardTitle>
                  <CardDescription className="text-slate-600">Average metrics per unit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl border border-indigo-200/50">
                    <span className="text-sm text-slate-700 font-medium">Avg. words per sentence</span>
                    <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      {stats.sentences > 0 ? Math.round(stats.words / stats.sentences) : 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl border border-indigo-200/50">
                    <span className="text-sm text-slate-700 font-medium">Avg. sentences per paragraph</span>
                    <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      {stats.paragraphs > 0 ? Math.round(stats.sentences / stats.paragraphs) : 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl border border-indigo-200/50">
                    <span className="text-sm text-slate-700 font-medium">Avg. characters per word</span>
                    <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      {stats.words > 0 ? Math.round(stats.charactersNoSpaces / stats.words) : 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Explore More Tools</h2>
            <p className="text-slate-600">Discover other powerful utilities to enhance your workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "QR Generator",
                description: "Create custom QR codes instantly",
                href: "/tools/qr-generator",
                gradient: "from-purple-500 to-pink-500",
                icon: "📱",
              },
              {
                title: "Image Converter",
                description: "Convert between PNG, JPG, WebP formats",
                href: "/tools/image-converter",
                gradient: "from-blue-500 to-cyan-500",
                icon: "🔄",
              },
              {
                title: "Background Remover",
                description: "Remove backgrounds from images instantly",
                href: "/tools/background-remover",
                gradient: "from-green-500 to-teal-500",
                icon: "✂️",
              },
            ].map((tool, index) => (
              <Link key={tool.href} href={tool.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">{tool.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all duration-300">
                    Try it now
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
