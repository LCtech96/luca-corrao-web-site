"use client"

interface FileData {
  id: string;
  file_name: string;
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
  return (
    <div className={className}>
      <div className="p-8 bg-white rounded-lg border text-center">
        <h3 className="text-xl font-bold mb-4">Image Gallery</h3>
        <p className="text-gray-600 mb-4">
          Questo componente sarà aggiornato a breve con le nuove funzionalità Supabase.
        </p>
        <p className="text-sm text-gray-500">
          Per gestire le immagini, utilizza il pannello Supabase Storage.
        </p>
      </div>
    </div>
  )
}
