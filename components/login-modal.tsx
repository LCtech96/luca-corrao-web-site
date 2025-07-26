"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SignIn } from "@clerk/nextjs"

interface LoginModalProps {
  onClose: () => void
}

export function LoginModal({ onClose }: LoginModalProps) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // Only render SignIn if Clerk is properly configured
  if (!clerkPublishableKey || clerkPublishableKey === 'pk_test_your-clerk-publishable-key') {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <p className="text-gray-600 mb-4">
              L'autenticazione non è configurata. Contatta l'amministratore.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Chiudi
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <SignIn />
      </DialogContent>
    </Dialog>
  )
} 