export default function AdminImageManager({
  userId,
  isAdmin = false,
  className,
}: {
  userId?: string
  isAdmin?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <div className="p-8 bg-white rounded-lg border text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Image Manager</h2>
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
