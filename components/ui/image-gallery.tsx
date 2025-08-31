"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Image as ImageIcon,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Copy,
  Eye,
  Calendar,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";

interface FileData {
  _id: Id<"files">;
  fileName: string;
  fileType: string;
  fileSize: number;
  description?: string;
  category: string;
  ownerId?: string;
  uploadedAt: number;
  url: string;
}

interface ImageGalleryProps {
  files: FileData[];
  className?: string;
  selectable?: boolean;
  onImageSelect?: (imageUrl: string) => void;
}

export function ImageGallery({
  files,
  className,
  selectable = false,
  onImageSelect,
}: ImageGalleryProps) {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<FileData | null>(null);
  const [editingFile, setEditingFile] = useState<FileData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<FileData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editForm, setEditForm] = useState({
    fileName: "",
    description: "",
    category: "",
  });

  const updateFile = useMutation(api.files.updateFile);
  const deleteFile = useMutation(api.files.deleteFile);

  // Filter files based on search and category
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(files.map(file => file.category)));

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = (file: FileData) => {
    setEditingFile(file);
    setEditForm({
      fileName: file.fileName,
      description: file.description || "",
      category: file.category,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingFile) return;

    try {
      await updateFile({
        fileId: editingFile._id,
        fileName: editForm.fileName,
        description: editForm.description,
        category: editForm.category,
      });

      toast({
        title: "File aggiornato",
        description: "Le informazioni del file sono state aggiornate con successo.",
      });

      setEditingFile(null);
    } catch (error) {
      console.error("Error updating file:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del file.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (file: FileData) => {
    try {
      await deleteFile({ fileId: file._id });
      
      toast({
        title: "File eliminato",
        description: "Il file è stato eliminato con successo.",
      });

      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del file.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiato",
      description: "L'URL dell'immagine è stato copiato negli appunti.",
    });
  };

  const downloadImage = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cerca per nome file o descrizione..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Categoria: {categoryFilter === "all" ? "Tutte" : categoryFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                Tutte le categorie
              </DropdownMenuItem>
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {filteredFiles.length} di {files.length} immagini
        </p>
        <div className="flex gap-2">
          {categories.map(category => (
            <Badge key={category} variant="outline" className="text-xs">
              {category}: {files.filter(f => f.category === category).length}
            </Badge>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm || categoryFilter !== "all" ? "Nessun risultato" : "Nessuna immagine"}
            </h3>
            <p className="text-gray-500">
              {searchTerm || categoryFilter !== "all" 
                ? "Prova a modificare i filtri di ricerca" 
                : "Le immagini caricate appariranno qui"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <Card key={file._id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="relative h-48 w-full">
                  <Image
                    src={file.url}
                    alt={file.fileName}
                    fill
                    className="object-cover"
                  />
                  {selectable && (
                    <div 
                      className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors cursor-pointer flex items-center justify-center"
                      onClick={() => onImageSelect?.(file.url)}
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-3 py-1 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">Seleziona</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Menu */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedImage(file)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizza
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(file)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifica
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copia URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadImage(file.url, file.fileName)}>
                        <Download className="w-4 h-4 mr-2" />
                        Scarica
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteConfirm(file)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Elimina
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {file.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-3">
                <h4 className="font-medium text-sm truncate mb-1">{file.fileName}</h4>
                {file.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {file.description}
                  </p>
                )}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{formatFileSize(file.fileSize)}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(file.uploadedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{selectedImage.fileName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative h-96 w-full">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.fileName}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Categoria</Label>
                  <p className="text-gray-600">{selectedImage.category}</p>
                </div>
                <div>
                  <Label>Dimensione</Label>
                  <p className="text-gray-600">{formatFileSize(selectedImage.fileSize)}</p>
                </div>
                <div>
                  <Label>Tipo</Label>
                  <p className="text-gray-600">{selectedImage.fileType}</p>
                </div>
                <div>
                  <Label>Caricato</Label>
                  <p className="text-gray-600">{formatDate(selectedImage.uploadedAt)}</p>
                </div>
                {selectedImage.description && (
                  <div className="col-span-2">
                    <Label>Descrizione</Label>
                    <p className="text-gray-600">{selectedImage.description}</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit File Modal */}
      {editingFile && (
        <Dialog open={!!editingFile} onOpenChange={() => setEditingFile(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifica File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fileName">Nome File</Label>
                <Input
                  id="fileName"
                  value={editForm.fileName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fileName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="description">Descrizione</Label>
                <Input
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingFile(null)}>
                  Annulla
                </Button>
                <Button onClick={handleSaveEdit}>
                  Salva Modifiche
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Conferma Eliminazione</AlertDialogTitle>
              <AlertDialogDescription>
                Sei sicuro di voler eliminare "{deleteConfirm.fileName}"? 
                Questa azione non può essere annullata.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleDelete(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700"
              >
                Elimina
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}