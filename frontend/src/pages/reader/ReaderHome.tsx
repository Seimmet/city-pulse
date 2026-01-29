import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, Globe, MapPin, BookOpen, Users, Calendar, 
  ArrowRight, Filter, Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cities, editions } from "@/data/mockData";
import { PushNotificationToggle } from "@/components/ui/PushNotificationToggle";

export function ReaderHome() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-charcoal to-charcoal-light rounded-2xl p-8 text-cream">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-gold text-sm font-medium mb-2">Welcome back, John</p>
            <h1 className="font-serif text-4xl mb-2">Discover {selectedCity.name}</h1>
            <p className="text-cream/70 max-w-md">
              Explore the latest events, venues, and cultural highlights from your city.
            </p>
          </div>
          <div className="flex items-end gap-3">
            <PushNotificationToggle />
            <Button variant="gold" size="lg">
              Browse Latest Edition
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Editions Read", value: "24", icon: BookOpen },
          { label: "Events Saved", value: "12", icon: Calendar },
          { label: "Favorites", value: "38", icon: Star },
          { label: "Cities Explored", value: "5", icon: Globe },
        ].map((stat) => (
          <Card key={stat.label} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-serif">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latest Editions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl mb-1">Latest Editions</h2>
            <p className="text-muted-foreground">Fresh content from {selectedCity.name}</p>
          </div>
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {editions.slice(0, 4).map((edition) => (
            <Link key={edition.id} to={`/reader/editions/${edition.id}`}>
              <Card className="card-hover overflow-hidden group cursor-pointer">
                <div className="aspect-[3/4] bg-gradient-to-br from-charcoal to-charcoal-light relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-gold/30" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Button variant="gold" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Now
                    </Button>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <Badge variant="outline" className="mb-2">{edition.city}</Badge>
                  <h3 className="font-serif text-lg font-semibold mb-1">{edition.title}</h3>
                  <p className="text-sm text-muted-foreground">{edition.pages} pages • {edition.date}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore Other Cities */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl mb-1">Explore Other Cities</h2>
            <p className="text-muted-foreground">Discover content from around the world</p>
          </div>
          <Button variant="outline">View All Cities</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cities.slice(0, 4).map((city) => (
            <Card key={city.id} className="card-hover cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-charcoal to-charcoal-light flex items-center justify-center shrink-0 group-hover:from-gold group-hover:to-gold-dark transition-all">
                    <Globe className="w-7 h-7 text-gold group-hover:text-charcoal transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold">{city.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {city.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                  <span>{city.editions} editions</span>
                  <span>{(city.subscribers / 1000).toFixed(0)}K readers</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
