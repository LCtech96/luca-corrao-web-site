"use client";

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
  return (
    <div className={cn("p-8 bg-gray-50 rounded-lg border-2 border-dashed text-center", className)}>
      <div className="space-y-4">
        <div className="text-6xl">📸</div>
        <h3 className="text-xl font-bold text-gray-700">Upload Immagini</h3>
        <p className="text-gray-600">
          Funzionalità di upload immagini in arrivo
        </p>
        <div className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold">
          Coming Soon
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Per ora, gestisci le immagini direttamente dal pannello Supabase Storage
        </p>
      </div>
    </div>
  );
}
