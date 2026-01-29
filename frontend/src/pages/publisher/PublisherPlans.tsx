
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPublisherPlans, createPlan } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Check, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export function PublisherPlans() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_amount: 0,
    interval: "month" as "month" | "year",
  });

  type Plan = {
    id: string;
    name: string;
    description?: string;
    price_amount: number;
    currency: string;
    interval: string;
    stripe_price_id: string;
    active: boolean;
  };

  const { data: plans, isLoading, error } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: fetchPublisherPlans,
  });

  const createMutation = useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setIsOpen(false);
      setFormData({
        name: "",
        description: "",
        price_amount: 0,
        interval: "month",
      });
      toast.success("Plan created successfully");
    },
    onError: (err) => {
      toast.error((err as Error).message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8 flex items-center gap-2"><Loader2 className="animate-spin" /> Loading plans...</div>;
  if (error) return (
    <div className="p-8">
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{(error as Error).message}</AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground">Manage your subscription tiers and pricing</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="gold">
              <Plus className="w-4 h-4 mr-2" />
              New Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Monthly Premium"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What's included?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_amount}
                    onChange={(e) => setFormData({ ...formData, price_amount: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interval">Interval</Label>
                  <Select 
                    value={formData.interval} 
                    onValueChange={(v) => setFormData({ ...formData, interval: v as "month" | "year" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Plan"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{plan.name}</span>
                <span className="text-xl font-bold">
                  ${(plan.price_amount / 100).toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
                </span>
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-2">
                 <div className="flex items-center text-sm text-muted-foreground">
                   <Check className="w-4 h-4 mr-2 text-green-500" />
                   Access to all editions
                 </div>
                 <div className="flex items-center text-sm text-muted-foreground">
                   <Check className="w-4 h-4 mr-2 text-green-500" />
                   Offline reading
                 </div>
                 {/* Status Badge */}
                 <div className="pt-4">
                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                     plan.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                   }`}>
                     {plan.active ? "Active" : "Archived"}
                   </span>
                 </div>
               </div>
            </CardContent>
          </Card>
        ))}

        {plans?.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            No subscription plans found. Create your first one to start monetizing!
          </div>
        )}
      </div>
    </div>
  );
}
