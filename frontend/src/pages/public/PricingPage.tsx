
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Loader2, Globe } from "lucide-react";
import { publisherPlans } from "@/data/mockData";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCities, fetchCityPlans, createCheckoutSession } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function PricingPage() {
  const navigate = useNavigate();
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  // Fetch Cities
  const { data: cities, isLoading: isLoadingCities } = useQuery({
    queryKey: ["cities"],
    queryFn: fetchCities,
  });

  // Fetch Plans for selected city
  const { data: cityPlans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["cityPlans", selectedCityId],
    queryFn: () => fetchCityPlans(selectedCityId),
    enabled: !!selectedCityId,
  });

  // Auto-select first city or use local storage
  useEffect(() => {
    if (cities && cities.length > 0 && !selectedCityId) {
      const savedCity = localStorage.getItem("city_id");
      if (savedCity && cities.find((c: any) => c.id === savedCity)) {
        setSelectedCityId(savedCity);
      } else {
        setSelectedCityId(cities[0].id);
      }
    }
  }, [cities, selectedCityId]);

  const handleSubscribe = async (planId: string) => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toast.error("Please login to subscribe");
      navigate("/login", { state: { from: "/pricing" } });
      return;
    }

    try {
      const { url } = await createCheckoutSession({
        planId,
        successUrl: window.location.origin + "/payment/success",
        cancelUrl: window.location.origin + "/pricing",
      });
      window.location.href = url;
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <PublicLayout>
      <div className="py-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-serif text-5xl md:text-6xl mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that works best for you. No hidden fees, cancel anytime.
            </p>
          </div>

          {/* Tabs for Reader/Publisher */}
          <Tabs defaultValue="readers" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="readers">For Readers</TabsTrigger>
              <TabsTrigger value="publishers">For Publishers</TabsTrigger>
            </TabsList>

            <TabsContent value="readers">
              {/* City Selector */}
              <div className="max-w-xs mx-auto mb-12">
                 <div className="flex items-center gap-2 mb-2 justify-center text-muted-foreground">
                   <Globe className="w-4 h-4" />
                   <span className="text-sm">Select your city</span>
                 </div>
                 {isLoadingCities ? (
                   <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                 ) : (
                   <Select value={selectedCityId} onValueChange={setSelectedCityId}>
                     <SelectTrigger>
                       <SelectValue placeholder="Select a city" />
                     </SelectTrigger>
                     <SelectContent>
                       {cities?.map((city: any) => (
                         <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 )}
              </div>

              {/* Plans Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {isLoadingPlans ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="h-96 bg-muted animate-pulse rounded-2xl" />
                  ))
                ) : cityPlans?.length > 0 ? (
                  cityPlans.map((plan: any) => (
                    <div
                      key={plan.id}
                      className="relative rounded-2xl p-8 bg-card border border-border hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-6">
                        <h3 className="font-serif text-2xl mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold font-serif">
                            ${(plan.price_amount / 100).toFixed(2)}
                          </span>
                          <span className="text-muted-foreground">
                            /{plan.interval}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-2 text-sm">{plan.description}</p>
                      </div>
                      
                      <ul className="space-y-4 mb-8">
                         <li className="flex items-start gap-3">
                           <Check className="w-5 h-5 shrink-0 text-success" />
                           <span className="text-muted-foreground">Full access to all editions</span>
                         </li>
                         <li className="flex items-start gap-3">
                           <Check className="w-5 h-5 shrink-0 text-success" />
                           <span className="text-muted-foreground">Offline reading</span>
                         </li>
                         <li className="flex items-start gap-3">
                           <Check className="w-5 h-5 shrink-0 text-success" />
                           <span className="text-muted-foreground">Support local journalism</span>
                         </li>
                      </ul>

                      <Button
                        variant="gold"
                        className="w-full"
                        size="lg"
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        Subscribe Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    {selectedCityId ? "No subscription plans available for this city yet." : "Please select a city to view plans."}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="publishers">
              <div className="grid md:grid-cols-3 gap-8">
                {publisherPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl p-8 ${
                      plan.popular
                        ? "bg-primary text-primary-foreground ring-4 ring-accent"
                        : "bg-card border border-border"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-accent text-accent-foreground text-sm font-medium px-4 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="font-serif text-2xl mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold font-serif">${plan.price}</span>
                        <span className={plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}>
                          /month
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 shrink-0 ${plan.popular ? "text-accent" : "text-success"}`} />
                          <span className={plan.popular ? "text-primary-foreground/90" : "text-muted-foreground"}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/register?role=publisher">
                      <Button
                        variant={plan.popular ? "gold" : "outline"}
                        className="w-full"
                        size="lg"
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* FAQ Teaser */}
          <div className="mt-20 text-center">
            <p className="text-muted-foreground">
              Have questions? Check out our{" "}
              <Link to="/faq" className="text-accent hover:underline">
                FAQ
              </Link>{" "}
              or{" "}
              <Link to="/contact" className="text-accent hover:underline">
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
