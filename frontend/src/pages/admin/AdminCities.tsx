import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCities, createCity, fetchPublishers, createPublisher, updateCity } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Globe, Building2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdminCities() {
  const queryClient = useQueryClient();
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isPubOpen, setIsPubOpen] = useState(false);
  
  // City Form
  const [cityName, setCityName] = useState("");
  const [cityCountry, setCityCountry] = useState("");

  // Publisher Form
  const [pubName, setPubName] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");

  const { data: cities, isLoading: citiesLoading, error: citiesError } = useQuery({
    queryKey: ["admin-cities"],
    queryFn: fetchCities,
  });

  const { data: publishers, isLoading: pubLoading } = useQuery({
    queryKey: ["admin-publishers"],
    queryFn: fetchPublishers,
  });

  const createCityMutation = useMutation({
    mutationFn: createCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cities"] });
      setIsCityOpen(false);
      setCityName("");
      setCityCountry("");
    },
  });

  const createPubMutation = useMutation({
    mutationFn: createPublisher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-publishers"] });
      setIsPubOpen(false);
      setPubName("");
      setSelectedCityId("");
    },
  });

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCityMutation.mutate({ name: cityName, country: cityCountry });
  };

  const handlePubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPubMutation.mutate({ 
      city_id: selectedCityId, 
      name: pubName,
      email: pubEmail,
      password: pubPassword
    });
  };

  // Helper to get publisher for a city
  const getPublisherForCity = (cityId: string) => {
    return publishers?.find((p: any) => p.city.id === cityId);
  };

  if (citiesLoading || pubLoading) return <div className="p-8">Loading data...</div>;
  if (citiesError) return <div className="p-8 text-red-500">Error loading cities</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold">City Management</h1>
          <p className="text-muted-foreground">Manage global cities and assign publishers</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCityOpen} onOpenChange={setIsCityOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Globe className="w-4 h-4 mr-2" />
                Add City
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New City</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCitySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>City Name</Label>
                  <Input value={cityName} onChange={e => setCityName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={cityCountry} onChange={e => setCityCountry(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={createCityMutation.isPending}>
                  Create City
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isPubOpen} onOpenChange={setIsPubOpen}>
            <DialogTrigger asChild>
              <Button variant="gold">
                <Building2 className="w-4 h-4 mr-2" />
                Assign Publisher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Publisher to City</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePubSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Publisher Name</Label>
                  <Input value={pubName} onChange={e => setPubName(e.target.value)} required placeholder="e.g. Condé Nast London" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select onValueChange={setSelectedCityId} value={selectedCityId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city: any) => {
                        const hasPub = getPublisherForCity(city.id);
                        return (
                          <SelectItem key={city.id} value={city.id} disabled={!!hasPub}>
                            {city.name}, {city.country} {hasPub ? "(Assigned)" : ""}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                {createPubMutation.isError && (
                   <Alert variant="destructive">
                     <AlertCircle className="h-4 w-4" />
                     <AlertTitle>Error</AlertTitle>
                     <AlertDescription>{(createPubMutation.error as Error).message}</AlertDescription>
                   </Alert>
                )}
                <Button type="submit" className="w-full" disabled={createPubMutation.isPending}>
                  Create Publisher License
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cities & Licenses</CardTitle>
          <CardDescription>Overview of all active cities and their assigned publishers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Publisher</TableHead>
                <TableHead>License Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities?.map((city: any) => {
                const publisher = getPublisherForCity(city.id);
                return (
                  <TableRow key={city.id}>
                    <TableCell className="font-medium">{city.name}</TableCell>
                    <TableCell>{city.country}</TableCell>
                    <TableCell>
                      <Badge variant={city.status === 'active' ? 'default' : 'secondary'}>
                        {city.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {publisher ? (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          {publisher.name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {publisher ? (
                        <Badge variant={publisher.license_status === 'active' ? 'outline' : 'destructive'}>
                          {publisher.license_status}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
