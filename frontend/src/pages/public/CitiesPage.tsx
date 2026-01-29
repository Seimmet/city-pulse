import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, BookOpen, Globe, ArrowRight } from "lucide-react";
import { cities } from "@/data/mockData";
import { useState } from "react";

export function CitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const regions = [
    { name: "All", count: cities.length },
    { name: "Americas", count: 2 },
    { name: "Europe", count: 3 },
    { name: "Asia Pacific", count: 3 },
  ];

  return (
    <PublicLayout>
      <div className="py-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-serif text-5xl md:text-6xl mb-6">
              Explore Cities Worldwide
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover premium digital magazines from {cities.length}+ cities across the globe
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {regions.map((region) => (
                <Button
                  key={region.name}
                  variant={region.name === "All" ? "default" : "outline"}
                  size="lg"
                >
                  {region.name}
                  <Badge variant="secondary" className="ml-2">
                    {region.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Cities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCities.map((city) => (
              <Link key={city.id} to={`/cities/${city.id}`}>
                <div className="group relative h-80 rounded-2xl overflow-hidden card-hover cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent z-10" />
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ 
                      backgroundImage: `url(https://images.unsplash.com/photo-${
                        city.name === 'New York' ? '1534430480872-3498386e7856' :
                        city.name === 'London' ? '1513635269975-59663e0ac1ad' :
                        city.name === 'Paris' ? '1502602898657-3e91760cbb34' :
                        city.name === 'Tokyo' ? '1540959733332-eab4deabeeaf' :
                        city.name === 'Dubai' ? '1512453979323-b6ccd2b7b3a4' :
                        city.name === 'Sydney' ? '1506973035872-a4ec16b8e8d9' :
                        city.name === 'Berlin' ? '1560969184-aec3514b03cf' :
                        '1525625293386-3f8f99389edd'
                      }?w=800&q=80)` 
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gold" />
                      <span className="text-sm text-cream/80">{city.country}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-cream mb-3">{city.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-cream/70">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {city.editions} editions
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {(city.subscribers / 1000).toFixed(0)}K readers
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="gold" size="sm">
                      Explore
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 text-center bg-muted/50 rounded-2xl p-12">
            <Globe className="w-16 h-16 mx-auto text-accent mb-6" />
            <h2 className="font-serif text-3xl mb-4">Your City Not Listed?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We're always expanding. Become a founding publisher for your city and bring premium content to your community.
            </p>
            <Link to="/publishers">
              <Button variant="gold" size="lg">
                Become a Publisher
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
