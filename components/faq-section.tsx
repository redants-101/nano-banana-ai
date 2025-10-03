import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What makes Nano Banana different from other AI image editors?",
    answer:
      "Nano Banana uses advanced natural language processing to understand complex editing instructions. Unlike traditional tools, you can describe what you want in plain English, and our AI handles the technical details. We also excel at character consistency and scene preservation, surpassing competitors like Flux Kontext.",
  },
  {
    question: "How does the image upload feature work?",
    answer:
      "Simply drag and drop your images or click the upload button. You can upload up to 9 reference images at once for batch processing. Our system supports JPG, PNG, and WebP formats up to 10MB per image. The AI analyzes your images and applies your text prompts while preserving important details.",
  },
  {
    question: "Can I use Nano Banana for commercial projects?",
    answer:
      "Yes! All images generated with Nano Banana can be used for commercial purposes. You retain full rights to your creations. Our Pro and Enterprise plans include additional features like priority processing, higher resolution outputs, and API access for integration into your workflows.",
  },
  {
    question: "What is character consistency and why does it matter?",
    answer:
      "Character consistency means maintaining the same facial features, expressions, and identity across multiple edits or generations. This is crucial for creating AI influencers, brand mascots, or any series of images featuring the same person or character. Nano Banana excels at this, making it perfect for UGC campaigns and storytelling.",
  },
  {
    question: "How fast is the image generation process?",
    answer:
      "Nano Banana is optimized for speed. Most edits complete in under 2 seconds, with simple transformations happening in milliseconds. Our lightning-fast processing is powered by optimized neural networks and efficient cloud infrastructure, so you can iterate quickly without waiting.",
  },
  {
    question: "Do you offer an API for developers?",
    answer:
      "Yes! Our API allows developers to integrate Nano Banana's powerful image editing capabilities into their own applications. The API supports all core features including natural language prompts, batch processing, and multi-image context. Check our API documentation for detailed integration guides and code examples.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-secondary/30">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about Nano Banana</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
