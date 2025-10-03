import { Sparkles, Layers, ImageIcon, Zap, Grid3x3, Palette } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Sparkles,
    title: "Natural Language Editing",
    description:
      "Simply describe what you want in plain English. Nano-banana AI understands complex instructions like GPT for images.",
    color: "text-primary",
  },
  {
    icon: Layers,
    title: "Character Consistency",
    description:
      "This model excels at preserving character details across edits. Maintain faces and identities flawlessly.",
    color: "text-primary",
  },
  {
    icon: ImageIcon,
    title: "Scene Preservation",
    description:
      "Edit specific elements while keeping your original backgrounds. Superior scene fidelity compared to Flux Kontext.",
    color: "text-primary",
  },
  {
    icon: Zap,
    title: "One-Shot Editing",
    description:
      "Perfect results in a single attempt. Nano-banana delivers one-shot image editing challenges effortlessly.",
    color: "text-primary",
  },
  {
    icon: Grid3x3,
    title: "Multi-Image Context",
    description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows.",
    color: "text-primary",
  },
  {
    icon: Palette,
    title: "AI UGC Creation",
    description: "Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns.",
    color: "text-primary",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2">Core Features</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Nano Banana?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nano-banana is the most advanced AI image editor on LMArena. Revolutionize your photo editing with natural
            language understanding.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
