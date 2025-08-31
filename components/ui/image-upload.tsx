"use client";

import React, { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  category?: string;
  ownerId?: string;
  className?: string;
  maxFiles?: number;
  accept?: string;
}

export function ImageUpload({
  onImageUploaded,
  category = "general",
  ownerId,
  className,
  maxFiles = 10,
  accept = "image/*",
}: ImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const storeFile = useMutation(api.files.storeFile);

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "File non valido",
          description: `${file.name} non è un'immagine valida.`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File troppo grande",
          description: `${file.name} supera il limite di 10MB.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, maxFiles));
    
    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImages(prev => [...prev, e.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Generate upload URL
        const uploadUrl = await generateUploadUrl();
        
        // Upload to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const { storageId } = await result.json();

        // Store file metadata
        const fileId = await storeFile({
          storageId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          category,
          ownerId,
          description: `Uploaded image: ${file.name}`,
        });

        // Get the file URL and call the callback
        const fileUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`;
        onImageUploaded(fileUrl);

        // Update progress
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      toast({
        title: "Upload completato",
        description: `${selectedFiles.length} immagine/i caricate con successo!`,
      });

      // Reset state
      setSelectedFiles([]);
      setPreviewImages([]);
      setUploadProgress(0);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Errore durante l'upload",
        description: "Si è verificato un errore durante il caricamento delle immagini.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card 
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          dragActive ? "border-amber-500 bg-amber-50" : "border-gray-300 hover:border-gray-400",
          uploading && "pointer-events-none opacity-50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Clicca per caricare o trascina qui le immagini
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, WEBP fino a 10MB ciascuna (max {maxFiles} file)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Preview Images */}
      {previewImages.length > 0 && (
        <div className="space-y-3">
          <Label>Anteprima ({previewImages.length} file selezionati)</Label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {previewImages.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="relative h-20 w-full rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Caricamento in corso...</Label>
            <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && !uploading && (
        <Button 
          onClick={uploadFiles}
          className="w-full bg-amber-600 hover:bg-amber-700"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Caricamento...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Carica {selectedFiles.length} Immagine{selectedFiles.length > 1 ? 'i' : ''}
            </>
          )}
        </Button>
      )}
    </div>
  );
}