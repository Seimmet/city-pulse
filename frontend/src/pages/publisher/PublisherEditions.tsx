import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEditions, createEdition, deleteEdition, updateEdition, publishEdition } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { Plus, Trash2, FileText, Calendar, Eye, Edit, Send } from "lucide-react";
import { Link } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PublisherEditions() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  type Edition = {
    id: string;
    title: string;
    description?: string;
    pdf_url: string;
    cover_url?: string;
    status: "draft" | "published" | "archived";
    created_at: string;
  };

  const { data: editions, isLoading, error } = useQuery<Edition[]>({
    queryKey: ["editions"],
    queryFn: fetchEditions,
  });

  const createMutation = useMutation({
    mutationFn: createEdition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editions"] });
      setIsOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; data: FormData }) => updateEdition(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editions"] });
      setIsOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEdition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editions"] });
      toast.success("Edition deleted");
    },
  });

  const publishMutation = useMutation({
    mutationFn: publishEdition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editions"] });
      toast.success("Edition published and notifications sent!");
    },
    onError: (err) => {
      toast.error("Failed to publish: " + err.message);
    }
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPdfFile(null);
    setCoverFile(null);
    setEditingId(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetForm();
  };

  const handleEdit = (edition: Edition) => {
    setEditingId(edition.id);
    setTitle(edition.title);
    setDescription(edition.description || "");
    setPdfFile(null); // Reset file inputs as we can't preload them
    setCoverFile(null);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId && !pdfFile) {
      alert("PDF file is required for new editions");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (description) formData.append("description", description);
    if (pdfFile) formData.append("pdf", pdfFile);
    if (coverFile) formData.append("cover", coverFile);

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <div className="p-8">Loading editions...</div>;
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
          <h1 className="text-3xl font-serif font-bold">City Editions</h1>
          <p className="text-muted-foreground">Manage your monthly digital magazines</p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="gold" onClick={() => setEditingId(null)}>
              <Plus className="w-4 h-4 mr-2" />
              New Edition
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Edition" : "Publish New Edition"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Edition Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Summer Issue 2025"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pdf">PDF File {editingId && "(Optional - leave empty to keep current)"}</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
                  required={!editingId}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image {editingId && "(Optional - leave empty to keep current)"}</Label>
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : (editingId ? "Update Edition" : "Publish Edition")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editions?.map((edition: Edition) => (
          <Card key={edition.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[3/4] bg-muted relative">
              {edition.cover_url ? (
                <img 
                  src={edition.cover_url} 
                  alt={edition.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FileText className="w-12 h-12 text-muted-foreground" />
                </div>
              )}

              <div className="absolute top-2 right-2 flex gap-2">
                 {edition.status === 'draft' && (
                   <Button 
                     size="icon" 
                     variant="default" 
                     className="h-8 w-8 shadow-sm bg-green-600 hover:bg-green-700 text-white"
                     title="Publish & Notify"
                     onClick={() => {
                        if (confirm("Publish this edition and notify subscribers?")) {
                          publishMutation.mutate(edition.id);
                        }
                     }}
                     disabled={publishMutation.isPending}
                   >
                     <Send className="w-4 h-4" />
                   </Button>
                 )}
                 <Link to={`/read/${edition.id}`} target="_blank">
                   <Button size="icon" variant="secondary" className="h-8 w-8 shadow-sm">
                     <Eye className="w-4 h-4" />
                   </Button>
                 </Link>
                 <Button 
                   size="icon" 
                   variant="secondary" 
                   className="h-8 w-8 shadow-sm"
                   onClick={() => handleEdit(edition)}
                 >
                   <Edit className="w-4 h-4" />
                 </Button>
                 <Button 
                   size="icon" 
                   variant="destructive" 
                   className="h-8 w-8 shadow-sm"
                   onClick={() => {
                     if (confirm("Are you sure you want to delete this edition?")) {
                       deleteMutation.mutate(edition.id);
                     }
                   }}
                 >
                   <Trash2 className="w-4 h-4" />
                 </Button>
              </div>

            </div>
            <CardContent className="p-4">
              <h3 className="font-serif font-bold text-lg mb-1">{edition.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {edition.description}
              </p>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(edition.created_at).toLocaleDateString()}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  edition.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {edition.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {editions?.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No editions found. Create your first one!
          </div>
        )}
      </div>
    </div>
  );
}
