interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

function Testimonial({ quote, author, role }: TestimonialProps) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-md transition-all duration-300 hover:shadow-lg">
      <p className="mb-4 text-card-foreground">{quote}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

export function TestimonialSection() {
  return (
    <div className="bg-muted/50 py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Trusted by Brands and Creators
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            See what our users are saying about CreatorConnect
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Testimonial
            quote="CreatorConnect has transformed how we run influencer campaigns. The AI negotiation feature saved us countless hours and helped us stay within budget."
            author="Sarah Johnson"
            role="Marketing Director, BeautyBlend"
          />
          <Testimonial
            quote="As a creator, I love how streamlined the contract and payment process is. No more chasing invoices or dealing with complicated paperwork."
            author="James Chen"
            role="Content Creator, 500K+ followers"
          />
          <Testimonial
            quote="The analytics dashboard gives us incredible insights into campaign performance. We can now clearly demonstrate ROI to our stakeholders."
            author="Michelle Rodriguez"
            role="Brand Manager, TechGadgets"
          />
        </div>
      </div>
    </div>
  );
}