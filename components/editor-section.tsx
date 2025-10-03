"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Sparkles, ImageIcon, Loader2, Check, AlertCircle } from "lucide-react"

export function EditorSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 检查文件大小（最大 10MB）
      if (file.size > 10 * 1024 * 1024) {
        setError("图片大小不能超过 10MB")
        return
      }

      // 清除之前的错误和结果
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

  // 处理图片生成
  const handleGenerate = async () => {
    // 验证输入
    if (!selectedImage) {
      setError("请先上传一张图片")
      return
    }

    if (!prompt.trim()) {
      setError("请输入提示词")
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedResult(null)
    setGeneratedImage(null)

    try {
      // 调用 API
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: selectedImage,
          prompt: prompt.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || "生成失败")
      }

      // 设置生成结果（文本和图片）
      setGeneratedResult(data.result)
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
      }
      console.log("生成成功:", data)
    } catch (err: any) {
      console.error("生成错误:", err)
      setError(err.message || "生成失败，请稍后重试")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="editor" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            Get Started
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Try The AI Editor</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of nano-banana's natural language image editing. Transform any photo with simple text
            commands.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Prompt Engine */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Prompt Engine
              </CardTitle>
              <CardDescription>Transform your image with AI-powered editing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Batch Processing{" "}
                  <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                    NEW
                  </Badge>
                </label>
                <p className="text-sm text-muted-foreground mb-3">
                  Enable batch mode to process multiple images at once
                </p>
              </div>

              <div>
                <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
                  Reference Image 0/9
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
                          Add Image
                          <br />
                          Max 10MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                  Main Prompt
                </label>
                <Textarea
                  id="prompt"
                  placeholder="A futuristic city powered by nano-technology, golden hour lighting, ultra detailed..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* 生成按钮 */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedImage || !prompt.trim()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Now
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
                Output Gallery
              </CardTitle>
              <CardDescription>
                {generatedResult ? "AI 生成结果" : "Your edits will instantly appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center min-h-[400px] flex flex-col items-center justify-center">
                {isGenerating ? (
                  // 加载状态
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-16 h-16 text-primary mb-4 animate-spin" />
                    <h3 className="font-semibold mb-2">AI 正在处理中...</h3>
                    <p className="text-sm text-muted-foreground">
                      这可能需要几秒钟，请稍候
                    </p>
                  </div>
                ) : generatedResult || generatedImage ? (
                  // 显示生成结果
                  <div className="w-full">
                    <div className="flex items-center justify-center gap-2 mb-4 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold">生成成功！</span>
                    </div>
                    
                    {/* 显示生成的图片 */}
                    {generatedImage && (
                      <div className="mb-4 rounded-lg overflow-hidden border-2 border-primary/20">
                        <img
                          src={generatedImage}
                          alt="AI 生成的图片"
                          className="w-full h-auto object-contain max-h-[400px]"
                        />
                      </div>
                    )}
                    
                    {/* 显示文本结果 */}
                    {generatedResult && (
                      <div className="bg-secondary/50 rounded-lg p-4 max-h-[300px] overflow-auto mb-4">
                        <p className="text-left whitespace-pre-wrap">{generatedResult}</p>
                      </div>
                    )}
                    
                    {/* 操作按钮 */}
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
                        重新生成
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
                          复制文字
                        </Button>
                      )}
                      {generatedImage && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // 下载图片
                            const link = document.createElement('a')
                            link.href = generatedImage
                            link.download = 'nano-banana-result.png'
                            link.click()
                          }}
                          className="flex-1 min-w-[120px]"
                        >
                          下载图片
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  // 默认状态
                  <>
                    <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Ready for instant generation</h3>
                    <p className="text-sm text-muted-foreground">
                      上传图片并输入提示词，点击生成按钮即可看到 AI 处理结果
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

function Badge({
  children,
  variant = "default",
  className = "",
}: { children: React.ReactNode; variant?: "default" | "secondary"; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variant === "secondary" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"} ${className}`}
    >
      {children}
    </span>
  )
}
