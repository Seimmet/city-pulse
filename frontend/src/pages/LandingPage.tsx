import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Globe, Users, Building2, Sparkles, Play, ChevronRight, MapPin } from "lucide-react";
import { cities, testimonials, stats } from "@/data/mockData";
import { PublicLayout } from "@/components/layout/PublicLayout";
import heroImage from "@/assets/hero-cityscape.jpg";

export function LandingPage() {
  return (
    <PublicLayout>
      <LandingContent />
    </PublicLayout>
  );
}

function LandingContent() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/80 to-charcoal/40" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-6 opacity-0 animate-fade-up stagger-1">
              <Sparkles className="w-4 h-4" />
              Discover 45+ Cities Worldwide
            </span>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream mb-6 leading-tight opacity-0 animate-fade-up stagger-2">
              Your City's Pulse,
              <span className="block text-gold">Beautifully Curated</span>
            </h1>
            
            <p className="text-lg md:text-xl text-cream/80 mb-8 max-w-xl opacity-0 animate-fade-up stagger-3">
              Experience premium digital magazines showcasing the best events, venues, and culture from cities around the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up stagger-4">
              <Link to="/register">
                <Button variant="gold" size="xl" className="w-full sm:w-auto">
                  Start Reading Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/publishers">
                <Button variant="heroSecondary" size="xl" className="w-full sm:w-auto border-cream text-cream hover:bg-cream hover:text-primary">
                  Become a Publisher
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 opacity-0 animate-fade-up stagger-5">
              <div>
                <p className="text-3xl font-serif text-gold">{stats.totalCities}+</p>
                <p className="text-sm text-cream/60">Cities</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-gold">285K+</p>
                <p className="text-sm text-cream/60">Subscribers</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-gold">1.2K+</p>
                <p className="text-sm text-cream/60">Editions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              The Future of City Magazines
            </h2>
            <p className="text-lg text-muted-foreground">
              Whether you're a reader discovering new experiences or a publisher building your city's voice, CityPulse delivers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "For Readers",
                description: "Access beautifully designed digital magazines with interactive flipbook experiences, curated event guides, and insider tips.",
                features: ["Interactive flipbooks", "Offline reading", "Personalized feeds"]
              },
              {
                icon: Building2,
                title: "For Publishers",
                description: "Launch and manage your city's digital magazine with powerful publishing tools, subscriber management, and revenue analytics.",
                features: ["Easy publishing", "Full analytics", "Revenue control"]
              },
              {
                icon: Users,
                title: "For Advertisers",
                description: "Reach engaged city audiences with premium ad placements in a trusted, high-quality editorial environment.",
                features: ["Targeted reach", "Premium formats", "Performance tracking"]
              }
            ].map((item, index) => (
              <div
                key={item.title}
                className="bg-card rounded-2xl p-8 shadow-elegant card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-2xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.description}</p>
                <ul className="space-y-2">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-gold" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              How CityPulse Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to your city's best-kept secrets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
            
            {[
              { step: "01", title: "Choose Your City", description: "Select from 45+ cities worldwide, each with its own dedicated publisher and local expertise." },
              { step: "02", title: "Subscribe & Read", description: "Access unlimited editions with our interactive flipbook reader, online or offline." },
              { step: "03", title: "Discover & Experience", description: "Explore curated events, venues, and cultural highlights tailored to your interests." }
            ].map((item, index) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground font-serif text-2xl flex items-center justify-center mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="font-serif text-2xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cities */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-3">
                Explore Featured Cities
              </h2>
              <p className="text-lg text-muted-foreground">
                Premium content from the world's most exciting destinations
              </p>
            </div>
            <Link to="/cities">
              <Button variant="outline" className="mt-4 md:mt-0">
                View All Cities
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.slice(0, 4).map((city) => (
              <Link
                key={city.id}
                to={`/cities/${city.id}`}
                className="group relative h-80 rounded-2xl overflow-hidden card-hover"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/10 transition-colors z-10" />
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url(https://images.unsplash.com/photo-${
                      city.name === 'New York' ? '1534430480872-3498386e7856' :
                      city.name === 'London' ? '1513635269975-59663e0ac1ad' :
                      city.name === 'Paris' ? '1502602898657-3e91760cbb34' :
                      '1540959733332-eab4deabeeaf'
                    }?w=800&q=80)` 
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span className="text-sm text-cream/80">{city.country}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-cream mb-2">{city.name}</h3>
                  <p className="text-sm text-cream/60">{city.subscribers.toLocaleString()} subscribers</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flipbook Preview */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold text-sm font-medium mb-4 block">Interactive Experience</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-cream">
                Read Like Never Before
              </h2>
              <p className="text-lg text-cream/80 mb-8">
                Our beautiful flipbook reader brings the magazine experience to life. Flip through pages naturally, zoom into details, and enjoy smooth animations on any device.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Realistic page-turning animations",
                  "High-resolution image zoom",
                  "Offline reading capability",
                  "Bookmark your favorites"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-cream/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant="gold" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Try Demo Flipbook
              </Button>
            </div>

            <div className="relative">
              {/* Flipbook Mockup */}
              <div className="relative bg-charcoal-light rounded-2xl p-8 shadow-2xl">
                <div className="aspect-[4/3] bg-cream rounded-lg overflow-hidden flex">
                  <div className="w-1/2 p-6 border-r border-border">
                    <div className="h-4 w-3/4 bg-muted rounded mb-4" />
                    <div className="h-3 w-full bg-muted/60 rounded mb-2" />
                    <div className="h-3 w-full bg-muted/60 rounded mb-2" />
                    <div className="h-3 w-2/3 bg-muted/60 rounded mb-6" />
                    <div className="h-32 w-full bg-muted rounded" />
                  </div>
                  <div className="w-1/2 p-6">
                    <div className="h-48 w-full bg-muted rounded mb-4" />
                    <div className="h-3 w-full bg-muted/60 rounded mb-2" />
                    <div className="h-3 w-3/4 bg-muted/60 rounded" />
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-gold' : 'bg-cream/30'}`} />
                  ))}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold rounded-2xl flex items-center justify-center animate-float shadow-gold">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Loved by Readers & Publishers
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands discovering the best of city life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-card rounded-2xl p-8 shadow-elegant"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-muted" />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Sparkles key={i} className="w-4 h-4 text-gold" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6">
              Ready to Discover Your City?
            </h2>
            <p className="text-lg text-cream/80 mb-8">
              Join 285,000+ readers and experience the best digital city magazines in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="gold" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/download">
                <Button size="xl" className="bg-cream/10 text-cream hover:bg-cream/20 border border-cream/20">
                  Download App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
