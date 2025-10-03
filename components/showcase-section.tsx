import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const showcaseItems = [
  {
    title: "Ultra-Fast Mountain Generation",
    description: "Created in 0.8 seconds with Nano Banana's optimized neural engine",
    image: "/majestic-mountain-range-at-golden-hour-with-dramat.jpg",
    badge: "Lightning-Fast Results",
  },
  {
    title: "Instant Garden Creation",
    description: "Complex scene rendered in milliseconds using Nano Banana technology",
    image: "/beautiful-japanese-garden-with-cherry-blossoms-and.jpg",
    badge: "Scene Preservation",
  },
  {
    title: "Tropical Paradise Transform",
    description: "Natural environment editing with perfect lighting preservation",
    image: "/tropical-beach-with-palm-trees-and-crystal-clear-t.jpg",
    badge: "Natural Lighting",
  },
  {
    title: "Aurora Borealis Magic",
    description: "Stunning atmospheric effects generated with AI precision",
    image: "/northern-lights-aurora-borealis-over-snowy-landsca.jpg",
    badge: "Atmospheric Effects",
  },
]

export function ShowcaseSection() {
  return (
    <section id="showcase" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            Showcase
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Lightning-Fast AI Creations</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what Nano Banana generates in milliseconds
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {showcaseItems.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{item.badge}</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
