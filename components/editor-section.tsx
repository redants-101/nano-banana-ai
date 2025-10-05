"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Sparkles, ImageIcon, Loader2, Check, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTranslations, useLocale } from "next-intl"

export function EditorSection() {
  const t = useTranslations('editor')
  const locale = useLocale()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(t('errors.imageSizeExceeded'))
        return
      }

      // Clear previous errors and results
      setError(null)
      setGeneratedResult(null)
      setGeneratedImage(null)

      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle image generation
  const handleGenerate = async () => {
    // Validate input
    if (!selectedImage) {
      setError(t('errors.uploadImageFirst'))
      return
    }

    if (!prompt.trim()) {
      setError(t('errors.enterPrompt'))
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedResult(null)
    setGeneratedImage(null)

    try {
      // Call API
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: selectedImage,
          prompt: prompt.trim(),
          locale: locale, // 传递当前语言
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || t('errors.generationFailed'))
      }

      // Set generated result (text and image)
      setGeneratedResult(data.result)
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
      }
      console.log("Generation successful:", data)
    } catch (err: any) {
      console.error("Generation error:", err)
      setError(err.message || t('errors.tryAgainLater'))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="editor" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            {t('badge')}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Prompt Engine */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {t('promptEngine')}
              </CardTitle>
              <CardDescription>{t('promptEngineDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('batchProcessing')}{" "}
                  <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                    {t('new')}
                  </Badge>
                </label>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('batchProcessingDescription')}
                </p>
              </div>

              <div>
                <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
                  {t('referenceImage')} 0/9
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {selectedImage ? (
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Uploaded"
                        className="max-h-40 mx-auto rounded-lg"
                      />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {t('addImage')}
                          <br />
                          {t('maxSize')}
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                  {t('mainPrompt')}
                </label>
                <Textarea
                  id="prompt"
                  placeholder={t('promptPlaceholder')}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Generate button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedImage || !prompt.trim()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('generating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('generateNow')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Gallery */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                {t('outputGallery')}
              </CardTitle>
              <CardDescription>
                {generatedResult ? t('aiGeneratedResult') : t('instantGeneration')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center min-h-[400px] flex flex-col items-center justify-center">
                {isGenerating ? (
                  // Loading state
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-16 h-16 text-primary mb-4 animate-spin" />
                    <h3 className="font-semibold mb-2">{t('processing')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('processingHint')}
                    </p>
                  </div>
                ) : generatedResult || generatedImage ? (
                  // Display generated result
                  <div className="w-full">
                    <div className="flex items-center justify-center gap-2 mb-4 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold">{t('generatedSuccessfully')}</span>
                    </div>
                    
                    {/* Display generated image */}
                    {generatedImage && (
                      <div className="mb-4 rounded-lg overflow-hidden border-2 border-primary/20">
                        <img
                          src={generatedImage}
                          alt="AI Generated Image"
                          className="w-full h-auto object-contain max-h-[400px]"
                        />
                      </div>
                    )}
                    
                    {/* Display text result */}
                    {generatedResult && (
                      <div className="bg-secondary/50 rounded-lg p-4 max-h-[300px] overflow-auto mb-4">
                        <p className="text-left whitespace-pre-wrap">{generatedResult}</p>
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGeneratedResult(null)
                          setGeneratedImage(null)
                          setPrompt("")
                        }}
                        className="flex-1 min-w-[120px]"
                      >
                        {t('regenerate')}
                      </Button>
                      {generatedResult && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedResult)
                          }}
                          className="flex-1 min-w-[120px]"
                        >
                          {t('copyText')}
                        </Button>
                      )}
                      {generatedImage && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Download image
                            const link = document.createElement('a')
                            link.href = generatedImage
                            link.download = 'nano-banana-result.png'
                            link.click()
                          }}
                          className="flex-1 min-w-[120px]"
                        >
                          {t('downloadImage')}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  // Default state
                  <>
                    <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">{t('readyForGeneration')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('uploadPromptHint')}
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}