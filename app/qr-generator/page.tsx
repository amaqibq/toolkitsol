"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { QrCodeIcon, Download, Copy, CheckCircle, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import QRCode from "qrcode"

interface QROptions {
  size: number
  errorCorrectionLevel: "L" | "M" | "Q" | "H"
  foregroundColor: string
  backgroundColor: string
}

export default function QRGeneratorPage() {
  const [inputText, setInputText] = useState("")
  const [qrDataURL, setQrDataURL] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrOptions, setQrOptions] = useState<QROptions>({
    size: 256,
    errorCorrectionLevel: "M",
    foregroundColor: "#000000",
    backgroundColor: "#ffffff",
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQRCode = async (text: string, options: QROptions) => {
    if (!text.trim()) {
      setQrDataURL("")
      return
    }

    setIsGenerating(true)

    try {
      // Use the qrcode library to generate proper QR code
      const dataURL = await QRCode.toDataURL(text, {
        width: options.size,
        margin: 1,
        color: {
          dark: options.foregroundColor,
          light: options.backgroundColor
        },
        errorCorrectionLevel: options.errorCorrectionLevel
      })
      
      setQrDataURL(dataURL)
    } catch (error) {
      console.error("Error generating QR code:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQRCode(inputText, qrOptions)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [inputText, qrOptions])

  const handleDownload = () => {
    if (!qrDataURL) return

    const link = document.createElement("a")
    link.href = qrDataURL
    link.download = `qr-code-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyText = async () => {
    if (!inputText) return

    try {
      await navigator.clipboard.writeText(inputText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  const sampleTexts = [
    "https://example.com",
    "Hello, World!",
    "Contact: john@example.com",
    "WiFi:T:WPA;S:MyNetwork;P:password123;;",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
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
              <Link href="/content-counter" className="text-slate-600 hover:text-blue-600 transition-colors">
                Content Counter
              </Link>
              <Link href="/background-remover" className="text-slate-600 hover:text-blue-600 transition-colors">
                Background Remover
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Instant QR Code Generation
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance"
          >
            Generate QR Codes
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              Instantly
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty"
          >
            Create custom QR codes from text, URLs, or any content with advanced styling options and instant download.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <QrCodeIcon className="w-4 h-4 text-white" />
                    </div>
                    Enter Your Content
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Type or paste the text, URL, or content you want to encode
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="qr-text" className="text-base font-medium text-slate-800">
                      Text or URL
                    </Label>
                    <Textarea
                      id="qr-text"
                      placeholder="Enter text, URL, email, or any content..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      rows={4}
                      className="resize-none border-2 border-slate-200 focus:border-purple-500 bg-white/90 backdrop-blur-sm rounded-xl"
                    />
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{inputText.length} characters</span>
                      {inputText && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyText}
                          className="h-auto p-2 text-xs hover:bg-purple-50"
                        >
                          {copied ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium text-slate-800">Quick Examples</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {sampleTexts.map((sample, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setInputText(sample)}
                          className="justify-start text-xs bg-white/60 backdrop-blur-sm border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 rounded-xl"
                        >
                          {sample.length > 35 ? `${sample.substring(0, 35)}...` : sample}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">⚙️</span>
                    </div>
                    Customization
                  </CardTitle>
                  <CardDescription className="text-slate-600">Adjust the appearance of your QR code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-slate-800">Size</Label>
                      <Select
                        value={qrOptions.size.toString()}
                        onValueChange={(value) => setQrOptions({ ...qrOptions, size: Number.parseInt(value) })}
                      >
                        <SelectTrigger className="border-2 border-slate-200 focus:border-blue-500 bg-white/90 backdrop-blur-sm rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-xl rounded-xl">
                          <SelectItem value="128">128px</SelectItem>
                          <SelectItem value="256">256px</SelectItem>
                          <SelectItem value="512">512px</SelectItem>
                          <SelectItem value="1024">1024px</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium text-slate-800">Error Correction</Label>
                      <Select
                        value={qrOptions.errorCorrectionLevel}
                        onValueChange={(value: "L" | "M" | "Q" | "H") =>
                          setQrOptions({ ...qrOptions, errorCorrectionLevel: value })
                        }
                      >
                        <SelectTrigger className="border-2 border-slate-200 focus:border-blue-500 bg-white/90 backdrop-blur-sm rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-xl rounded-xl">
                          <SelectItem value="L">Low (7%)</SelectItem>
                          <SelectItem value="M">Medium (15%)</SelectItem>
                          <SelectItem value="Q">Quartile (25%)</SelectItem>
                          <SelectItem value="H">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-slate-800">Foreground Color</Label>
                      <Input
                        type="color"
                        value={qrOptions.foregroundColor}
                        onChange={(e) => setQrOptions({ ...qrOptions, foregroundColor: e.target.value })}
                        className="w-full h-12 border-2 border-slate-200 cursor-pointer rounded-xl"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium text-slate-800">Background Color</Label>
                      <Input
                        type="color"
                        value={qrOptions.backgroundColor}
                        onChange={(e) => setQrOptions({ ...qrOptions, backgroundColor: e.target.value })}
                        className="w-full h-12 border-2 border-slate-200 cursor-pointer rounded-xl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-slate-900">Generated QR Code</CardTitle>
                  <CardDescription className="text-slate-600">
                    {inputText ? "Your QR code is ready" : "Enter content to generate QR code"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-6">
                    {inputText ? (
                      <>
                        <div className="border border-slate-200 rounded-2xl p-6 bg-gradient-to-br from-slate-50/50 to-blue-50/50">
                          {qrDataURL ? (
                            <img
                              src={qrDataURL || "/placeholder.svg"}
                              alt="Generated QR Code"
                              className="max-w-full h-auto rounded-lg"
                              style={{ width: Math.min(qrOptions.size, 300) }}
                            />
                          ) : (
                            <div
                              className="flex items-center justify-center bg-slate-100 rounded-lg"
                              style={{ width: Math.min(qrOptions.size, 300), height: Math.min(qrOptions.size, 300) }}
                            >
                              <span className="text-slate-500 font-medium">
                                {isGenerating ? "Generating..." : "QR Code"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-3">
                          <Button
                            onClick={handleDownload}
                            disabled={!qrDataURL}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PNG
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setInputText("")}
                            className="px-6 py-3 rounded-xl border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 bg-transparent"
                          >
                            Clear
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center space-y-6 py-12">
                        <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-blue-50/50">
                          <QrCodeIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-center max-w-sm">
                          Enter text or URL in the input field to generate your QR code
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Explore More Tools</h2>
            <p className="text-slate-600">Discover other powerful utilities to enhance your workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Image Converter",
                description: "Convert between PNG, JPG, WebP formats",
                href: "/image-converter",
                gradient: "from-blue-500 to-cyan-500",
                icon: "🔄",
              },
              {
                title: "Content Counter",
                description: "Analyze text length and readability",
                href: "/content-counter",
                gradient: "from-green-500 to-teal-500",
                icon: "📝",
              },
              {
                title: "Background Remover",
                description: "Remove backgrounds from images instantly",
                href: "/background-remover",
                gradient: "from-purple-500 to-pink-500",
                icon: "✂️",
              },
            ].map((tool, index) => (
              <Link key={tool.href} href={tool.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
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

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
