import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Digital Artist",
    avatar: "/professional-woman-portrait.png",
    content:
      "Nano Banana has completely transformed my workflow. The character consistency is unmatched - I can finally create cohesive series without worrying about variations.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Content Creator",
    avatar: "/professional-man-portrait.png",
    content:
      "The natural language editing is a game-changer. I just describe what I want and it delivers perfectly. Way better than spending hours in traditional editors.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Marketing Director",
    avatar: "/confident-businesswoman.png",
    content:
      "We use Nano Banana for all our UGC campaigns now. The multi-image support and consistency features save us countless hours and deliver professional results every time.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Creators</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of artists and creators who trust Nano Banana
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
