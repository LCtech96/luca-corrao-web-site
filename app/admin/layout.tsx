import { AdminHeader, AdminNav } from '@/components/admin/admin-nav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <AdminNav />
          </div>
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
