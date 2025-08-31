"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";
import { ImageGallery } from "@/components/ui/image-gallery";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Eye,
  Save,
  X,
  MapPin,
  Users,
  Star,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import type { Id } from "@/convex/_generated/dataModel";

interface AccommodationForm {
  name: string;
  subtitle: string;
  description: string;
  address: string;
  distance: string;
  capacity: string;
  features: string[];
  highlight: string;
  price: string;
  cleaningFee: number | undefined;
  petsAllowed: boolean;
  petSupplement: number | undefined;
  owner: string;
  rating: number | undefined;
  mainImage: string;
  images: string[];
  imageDescriptions: string[];
}

const initialForm: AccommodationForm = {
  name: "",
  subtitle: "",
  description: "",
  address: "",
  distance: "",
  capacity: "",
  features: [],
  highlight: "",
  price: "",
  cleaningFee: undefined,
  petsAllowed: false,
  petSupplement: undefined,
  owner: "Luca Corrao",
  rating: undefined,
  mainImage: "",
  images: [],
  imageDescriptions: [],
};

export default function AdminStructuresPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"accommodations"> | null>(null);
  const [form, setForm] = useState<AccommodationForm>(initialForm);
  const [newFeature, setNewFeature] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("list");

  // Convex queries and mutations
  const accommodations = useQuery(api.accommodations.getAll) || [];
  const files = useQuery(api.files.getFilesByCategory, { category: "accommodation" }) || [];
  const createAccommodation = useMutation(api.accommodations.create);
  const updateAccommodation = useMutation(api.accommodations.update);
  const deleteAccommodation = useMutation(api.accommodations.remove);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateAccommodation({
          id: editingId,
          ...form,
          cleaningFee: form.cleaningFee || undefined,
          petSupplement: form.petSupplement || undefined,
          rating: form.rating || undefined,
        });
        toast({
          title: "Struttura aggiornata",
          description: "La struttura è stata aggiornata con successo!",
        });
      } else {
        await createAccommodation({
          ...form,
          cleaningFee: form.cleaningFee || undefined,
          petSupplement: form.petSupplement || undefined,
          rating: form.rating || undefined,
        });
        toast({
          title: "Struttura creata",
          description: "La nuova struttura è stata creata con successo!",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving accommodation:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (accommodation: any) => {
    setEditingId(accommodation._id);
    setForm({
      name: accommodation.name || "",
      subtitle: accommodation.subtitle || "",
      description: accommodation.description || "",
      address: accommodation.address || "",
      distance: accommodation.distance || "",
      capacity: accommodation.capacity || "",
      features: accommodation.features || [],
      highlight: accommodation.highlight || "",
      price: accommodation.price || "",
      cleaningFee: accommodation.cleaningFee,
      petsAllowed: accommodation.petsAllowed || false,
      petSupplement: accommodation.petSupplement,
      owner: accommodation.owner || "Luca Corrao",
      rating: accommodation.rating,
      mainImage: accommodation.mainImage || "",
      images: accommodation.images || [],
      imageDescriptions: accommodation.imageDescriptions || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: Id<"accommodations">) => {
    if (confirm("Sei sicuro di voler eliminare questa struttura?")) {
      try {
        await deleteAccommodation({ id });
        toast({
          title: "Struttura eliminata",
          description: "La struttura è stata eliminata con successo!",
        });
      } catch (error) {
        console.error("Error deleting accommodation:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante l'eliminazione.",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setNewFeature("");
    setUploadedImages([]);
  };

  const addFeature = () => {
    if (newFeature.trim() && !form.features.includes(newFeature.trim())) {
      setForm(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleImageUploaded = (imageUrl: string) => {
    setUploadedImages(prev => [...prev, imageUrl]);
    if (!form.mainImage) {
      setForm(prev => ({ ...prev, mainImage: imageUrl }));
    }
    setForm(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
  };

  const removeImage = (imageUrl: string) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl),
      mainImage: prev.mainImage === imageUrl ? prev.images[0] || "" : prev.mainImage
    }));
    setUploadedImages(prev => prev.filter(img => img !== imageUrl));
  };

  const setAsMainImage = (imageUrl: string) => {
    setForm(prev => ({ ...prev, mainImage: imageUrl }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestione Strutture</h1>
            <p className="text-gray-600 mt-2">Amministra le tue strutture ricettive e le immagini</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuova Struttura
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Modifica Struttura" : "Nuova Struttura"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Informazioni Base</TabsTrigger>
                    <TabsTrigger value="features">Caratteristiche</TabsTrigger>
                    <TabsTrigger value="images">Immagini</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome Struttura *</Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="subtitle">Sottotitolo</Label>
                        <Input
                          id="subtitle"
                          value={form.subtitle}
                          onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descrizione *</Label>
                      <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                        required
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="address">Indirizzo</Label>
                        <Input
                          id="address"
                          value={form.address}
                          onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="distance">Distanze</Label>
                        <Input
                          id="distance"
                          value={form.distance}
                          onChange={(e) => setForm(prev => ({ ...prev, distance: e.target.value }))}
                          placeholder="es. 50m da Piazza Duomo, 300m dal mare"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="capacity">Capacità *</Label>
                        <Input
                          id="capacity"
                          value={form.capacity}
                          onChange={(e) => setForm(prev => ({ ...prev, capacity: e.target.value }))}
                          required
                          placeholder="es. 4 persone"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Prezzo</Label>
                        <Input
                          id="price"
                          value={form.price}
                          onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="es. €80/notte"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="cleaningFee">Costo Pulizie (€)</Label>
                        <Input
                          id="cleaningFee"
                          type="number"
                          value={form.cleaningFee || ""}
                          onChange={(e) => setForm(prev => ({ 
                            ...prev, 
                            cleaningFee: e.target.value ? Number(e.target.value) : undefined 
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="petSupplement">Supplemento Animali (€)</Label>
                        <Input
                          id="petSupplement"
                          type="number"
                          value={form.petSupplement || ""}
                          onChange={(e) => setForm(prev => ({ 
                            ...prev, 
                            petSupplement: e.target.value ? Number(e.target.value) : undefined 
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">Rating (1-5)</Label>
                        <Input
                          id="rating"
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          value={form.rating || ""}
                          onChange={(e) => setForm(prev => ({ 
                            ...prev, 
                            rating: e.target.value ? Number(e.target.value) : undefined 
                          }))}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-4">
                    <div>
                      <Label>Caratteristiche</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Aggiungi caratteristica"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                        />
                        <Button type="button" onClick={addFeature} variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {form.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {feature}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-500"
                              onClick={() => removeFeature(feature)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="highlight">Punto di Forza</Label>
                      <Input
                        id="highlight"
                        value={form.highlight}
                        onChange={(e) => setForm(prev => ({ ...prev, highlight: e.target.value }))}
                        placeholder="es. Vista mare panoramica"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="space-y-4">
                    <div>
                      <Label>Carica Nuove Immagini</Label>
                      <ImageUpload
                        onImageUploaded={handleImageUploaded}
                        category="accommodation"
                        className="mt-2"
                      />
                    </div>

                    {form.images.length > 0 && (
                      <div>
                        <Label>Immagini Caricate ({form.images.length})</Label>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          {form.images.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <div className="relative h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                                <Image
                                  src={imageUrl}
                                  alt={`Immagine ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                {form.mainImage === imageUrl && (
                                  <div className="absolute top-2 left-2">
                                    <Badge className="bg-green-600 text-white text-xs">
                                      <Star className="w-3 h-3 mr-1" />
                                      Principale
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex gap-2">
                                  {form.mainImage !== imageUrl && (
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => setAsMainImage(imageUrl)}
                                    >
                                      <Star className="w-3 h-3" />
                                    </Button>
                                  )}
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeImage(imageUrl)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annulla
                  </Button>
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? "Aggiorna" : "Crea"} Struttura
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList>
            <TabsTrigger value="list">
              <Eye className="w-4 h-4 mr-2" />
              Strutture ({accommodations.length})
            </TabsTrigger>
            <TabsTrigger value="gallery">
              <ImageIcon className="w-4 h-4 mr-2" />
              Galleria Immagini ({files.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="grid gap-6">
              {accommodations.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Nessuna struttura trovata
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Inizia creando la tua prima struttura ricettiva
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)} className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Crea Prima Struttura
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                accommodations.map((accommodation) => (
                  <Card key={accommodation._id} className="overflow-hidden">
                    <div className="flex">
                      <div className="relative w-48 h-32 flex-shrink-0">
                        {accommodation.mainImage ? (
                          <Image
                            src={accommodation.mainImage}
                            alt={accommodation.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{accommodation.name}</h3>
                            {accommodation.subtitle && (
                              <p className="text-amber-600 font-medium">{accommodation.subtitle}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(accommodation)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(accommodation._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{accommodation.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          {accommodation.distance && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {accommodation.distance}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {accommodation.capacity}
                          </div>
                          {accommodation.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {accommodation.rating}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {accommodation.features?.slice(0, 6).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {accommodation.features?.length > 6 && (
                            <Badge variant="outline" className="text-xs">
                              +{accommodation.features.length - 6} altro
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <ImageGallery files={files} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
